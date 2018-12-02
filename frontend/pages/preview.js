import React, { Component } from 'react';
import Error from 'next/error';
import Layout from '../components/Layout';
import PageWrapper from '../components/PageWrapper';
import Config from '../config';
import { api } from '../utils/Helpers';

class Preview extends Component {

	constructor() {
		super();
		this.state = {
			post: null
		};
	}

	componentDidMount() {
		const { id, wpnonce, menu, settings } = this.props.url.query;

		api(
			`${Config.apiUrl}/wp-json/postlight/v1/post/preview?id=${id}&_wpnonce=${wpnonce}`,
			{ credentials: 'include' } // required for cookie nonce auth
		)
			.then((res) => {
				this.setState({
					post: res
				});
			});
	}

	render() {
		if (
			this.state.post &&
			this.state.post.code &&
			this.state.post.code === 'rest_cookie_invalid_nonce'
		) {
			return <Error statusCode={ 404 } />;
		}

		return (
			<Layout menu={ this.props.menu }>
				<h1>{ this.state.post ? this.state.post.title.rendered : '' }</h1>
				<div
					dangerouslySetInnerHTML={ {
						__html: this.state.post
							? this.state.post.content.rendered
							: ''
					} }
				/>
			</Layout>
		);
	}

}

export default PageWrapper(Preview);
