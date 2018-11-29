import React, { Component } from 'react';
import Link from 'next/link';
import Error from 'next/error';
import Layout from '../components/Layout';
import PageWrapper from '../components/PageWrapper';
import { menuPropTypes } from '../utils/types.spec';
import Config from '../config';
import { api } from '../utils/Helpers';

class Category extends Component {

	static propTypes = {
		menu: menuPropTypes
	}

	static async getInitialProps(context) {
		const { slug, menu, settings } = context.query;
		const categoriesEndpoint = `${Config.apiUrl}/wp-json/wp/v2/categories?slug=${slug}`;
		const categories = await api(categoriesEndpoint).then((response) => response);

		if (categories.length > 0) {
			const postsEndpoint = `${Config.apiUrl}/wp-json/wp/v2/posts?_embed&categories=${
				categories[0].id
			}`;
			const posts = await api(postsEndpoint).then((response) => response);

			return {
				settings,
				menu,
				categories,
				posts
			};
		}

		return { categories };
	}
	render() {
		if (this.props.categories.length == 0) {
			return <Error statusCode={ 404 } />;
		}

		const posts = this.props.posts.map((post, index) =>
			<ul key={ index }>
				<li>
					<Link
						as={ `/post/${post.slug}` }
						href={ `/post?slug=${post.slug}&apiRoute=post` }
					>
						<a>{ post.title.rendered }</a>
					</Link>
				</li>
			</ul>
		);


		return (
			<Layout menu={ this.props.menu }>
				<h1>{ this.props.categories[0].name } Posts</h1>
				{ posts }
			</Layout>
		);
	}

}

export default PageWrapper(Category);
