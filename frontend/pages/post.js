import React, { Component, Fragment } from 'react';
import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import Error from 'next/error';
import Layout from '../components/Layout';
import PageWrapper from '../components/PageWrapper';
import { menuPropTypes, postPropTypes } from '../utils/types.spec';
import Config from '../config';

class Post extends Component {

	static propTypes = {
		post: postPropTypes,
		menu: menuPropTypes
	}

	static async getInitialProps(context) {
		const { id, slug, apiRoute } = context.query;
		let { menu } = context.query;

		const res = await fetch(
			`${Config.apiUrl}/wp-json/better-rest-endpoints/v1/${apiRoute}/${apiRoute === 'page' ? id : slug}`
		);
		const post = await res.json();

		menu = typeof menu === 'string'
			? JSON.parse(menu)
			: menu;

		return {
			menu,
			post
		};
	}

	buildYoastSEOHead(yoast) {
		return (
			<Head>
				<title>{ yoast.yoast_wpseo_title }</title>
				{ yoast.yoast_wpseo_metadesc &&
					<meta name="description" content={ yoast.yoast_wpseo_metadesc } />
				}
			</Head>
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

		return <div>{'This page has ACF data — but we haven\'t built out any ACF components yet!'}</div>
	}

	renderDefaultLayout(title, content) {
		return (
			<Fragment>
				<h1>{ title }</h1>
				<div
					dangerouslySetInnerHTML={ {
						__html: content
					} }
				/>
			</Fragment>
		)
	}

	render() {
		const { title, content, acf, yoast } = this.props.post;

		if (!title) {
			return <Error statusCode={ 404 } />;
		}

		return (
			<Layout menu={ this.props.menu }>
				{
					yoast
						? this.buildYoastSEOHead(yoast)
						: this.buildDefaultSEOHead(title)
				}
				{
					acf && acf.flexible_layout
						? this.renderACFLayout(acf.flexible_layout)
						: this.renderDefaultLayout(title, content)
				}
			</Layout>
		);
	}

}

export default PageWrapper(Post);
