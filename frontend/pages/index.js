import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import Layout from '../components/Layout';
import PageWrapper from '../components/PageWrapper';
import Config from '../config';

const headerImageStyle = {
	marginTop: 50,
	marginBottom: 50
};

class Index extends Component {

	static async getInitialProps(context) {
		const { menu } = context.query;
		const pageRes = await fetch(
			`${Config.apiUrl}/wp-json/postlight/v1/page?slug=home`
		);
		const page = await pageRes.json();
		const postsRes = await fetch(
			`${Config.apiUrl}/wp-json/better-rest-endpoints/v1/posts?content=false`
		);
		const posts = await postsRes.json();
		const pagesRes = await fetch(
			`${Config.apiUrl}/wp-json/better-rest-endpoints/v1/pages?content=false`
		);
		const pages = await pagesRes.json();

		return {
			menu,
			page,
			posts,
			pages
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
