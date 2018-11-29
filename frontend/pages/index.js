import React, { Component } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import PageWrapper from '../components/PageWrapper';
import Config from '../config';
import { api } from '../utils/Helpers';

const headerImageStyle = {
	marginTop: 50,
	marginBottom: 50
};

class Index extends Component {

	static async getInitialProps(context) {
		const { menu, settings, options } = context.query;
		const pageEndpoint = `${Config.apiUrl}/wp-json/postlight/v1/page?slug=home`;
		const postsEndpoint = `${Config.apiUrl}/wp-json/better-rest-endpoints/v1/posts?content=false`;
		const pagesEndpoint = `${Config.apiUrl}/wp-json/better-rest-endpoints/v1/pages?content=false`;
		const page = await api(pageEndpoint).then((response) => response);
		const posts = await api(postsEndpoint).then((response) => response);
		const pages = await api(pagesEndpoint).then((response) => response);

		return {
			settings,
			menu,
			page,
			posts,
			pages,
			options
		};
	}

	render() {
		const posts = this.props.posts.map((post, index) =>
			<ul key={ index }>
				<li>
					<Link
						as={ `/${post.slug}` }
						href={ `/post?slug=${post.slug}&apiRoute=post` }
					>
						<a>{ post.title.rendered }</a>
					</Link>
				</li>
			</ul>
		);

		const pages = this.props.pages.map((page, index) =>
			<ul key={ index }>
				<li>
					<Link
						as={ `/${page.parent ? `${page.parent}/${page.slug}` : page.slug}` }
						href={ `/post?slug=${page.slug}&apiRoute=page` }
					>
						<a>{ page.title.rendered }</a>
					</Link>
				</li>
			</ul>
		);

		return (
			<Layout menu={ this.props.menu }>
				<img
					alt=""
					src="/static/images/wordpress-plus-react-header.png"
					width="815"
					style={ headerImageStyle }
				/>
				<h1>{ this.props.page.title.rendered }</h1>
				<div
					dangerouslySetInnerHTML={ {
						__html: this.props.page.content.rendered
					} }
				/>
				<h2>Posts</h2>
				{ posts }
				<h2>Pages</h2>
				{ pages }
			</Layout>
		);
	}

}

export default PageWrapper(Index);
