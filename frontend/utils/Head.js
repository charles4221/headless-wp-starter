import React, { Component } from 'react';
import Head from 'next/head';
import stylesheet from '../src/styles/style.scss'

class DocumentHead extends Component {

	render() {

		return (
			<Head>
				<style dangerouslySetInnerHTML={ { __html: stylesheet } } />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<meta charSet="utf-8" />
				<title>WordPress + React Starter Kit Frontend by Postlight</title>
			</Head>
		);
	}

}

export default DocumentHead;
