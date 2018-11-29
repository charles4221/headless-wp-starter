import React from 'react';
import App, { Container } from 'next/app';

export default class WPReact extends App {

	static async getInitialProps({ Component, router, ctx }) {
		let pageProps = {}

		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx)
		}

		return { pageProps }
	}

	constructor(props) {
		super(props);

		const { pageProps } = props;

		this.state = {
			menu: pageProps.menu,
			settings: pageProps.settings,
			options: pageProps.options
		}
	}

	render () {
		const { Component, pageProps } = this.props

		return (
			<Container>
				<Component {...pageProps} {...this.state} />
			</Container>
		)
	}

}
