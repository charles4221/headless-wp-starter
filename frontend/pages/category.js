import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Error from 'next/error';
import Layout from '../components/Layout';
import PageWrapper from '../components/PageWrapper';
import { menuPropTypes, postPropTypes, categoryPropTypes } from '../utils/types.spec';
import Config from '../config';
import { api } from '../utils/Helpers';

class Category extends Component {

	static propTypes = {
		menu: menuPropTypes,
		categories: PropTypes.arrayOf(categoryPropTypes),
		posts: PropTypes.arrayOf(postPropTypes)
	}

	static async getInitialProps(context) {
		const { slug, menu, settings, options } = context.query;
		const categoriesEndpoint = `${Config.apiUrl}/wp-json/wp/v2/categories?slug=${slug}`;
		const categories = await api(categoriesEndpoint).then((response) => response);

		if (categories.length > 0) {
			const postsEndpoint = `${Config.apiUrl}/wp-json/better-rest-endpoints/v1/posts?category_id=${categories[0].id}&content=false`;
			const posts = await api(postsEndpoint).then((response) => response);

			return {
				settings,
				menu,
				categories,
				posts,
				options
			};
		}

		return { categories };
	}

	render() {
		if (this.props.categories.length === 0) {
			return <Error statusCode={ 404 } />;
		}

		const posts = this.props.posts.map((post, index) =>
			<ul key={ index }>
				<li>
					<Link
						as={ `/${post.slug}` }
						href={ `/post?id=${post.id}&slug=${post.slug}&apiRoute=post` }
					>
						<a>{ post.title }</a>
					</Link>
				</li>
			</ul>
		);

		return (
			<Layout { ...this.props }>
				<h1>{ this.props.categories[0].name } Posts</h1>
				{ posts }
			</Layout>
		);
	}

}

export default PageWrapper(Category);
