import React, { Component } from 'react';
import Head from 'next/head';
import Error from 'next/error';
import Layout from '../components/Layout';
import PageWrapper from '../components/PageWrapper';
import { menuPropTypes, postPropTypes } from '../utils/types.spec';
import Config from '../config';
import Yoast from '../utils/Yoast';
import { api } from '../utils/Helpers';

class Post extends Component {

	static propTypes = {
		post: postPropTypes.isRequired,
		menu: menuPropTypes
	}

	static async getInitialProps(context) {
		const { id, slug, apiRoute, menu, settings, options } = context.query;
		const endpoint = `${Config.apiUrl}/wp-json/better-rest-endpoints/v1/${apiRoute}/${apiRoute === 'page' ? id : slug}`;

		const post = await api(endpoint).then((response) => response);

		return {
			settings,
			menu,
			post,
			options
		};
	}

	buildYoastSEOHead(post, settings) {
		return (
			<Yoast { ...post } settings={ settings } />
		)
	}

	buildDefaultSEOHead(title) {
		return (
			<Head>
				<title>{ title }</title>
			</Head>
		)
	}

	renderACFLayout(data) {
		console.log(data);

		return (
			<div>
				<p>{'This page has ACF data — but you haven\'t built out any ACF components yet! The data has been logged to console and printed below for your reference.'}</p>
				<code>
					{ JSON.stringify(data) }
				</code>
			</div>
		)
	}

	renderDefaultLayout(title, content) {
		return (
			<>
				<h1>{ title }</h1>
				<div
					dangerouslySetInnerHTML={ {
						__html: content
					} }
				/>
			</>
		)
	}

	render() {
		const { title, content, acf, yoast } = this.props.post;

		if (!title) {
			return <Error statusCode={ 404 } />;
		}

		return (
			<Layout { ...this.props }>
				{
					yoast
						? this.buildYoastSEOHead(this.props.post, this.props.settings)
						: this.buildDefaultSEOHead(title)
				}
				{
					acf && acf.layout
						? this.renderACFLayout(acf.layout)
						: this.renderDefaultLayout(title, content)
				}
			</Layout>
		);
	}

}

export default PageWrapper(Post);
