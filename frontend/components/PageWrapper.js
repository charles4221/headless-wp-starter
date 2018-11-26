import React, { Component } from 'react';

const PageWrapper = (Comp) =>
	class Wrap extends Component {

		static async getInitialProps(args) {
			return {
				...Comp.getInitialProps ? await Comp.getInitialProps(args) : null
			};
		}

		render() {
			return (
				<Comp { ...this.props } />
			)
		}

	}

export default PageWrapper;
