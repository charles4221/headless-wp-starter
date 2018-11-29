import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import { menuPropTypes } from '../utils/types.spec';
import Config from '../config';

Router.onRouteChangeStart = () => {
	NProgress.start();
};

Router.onRouteChangeComplete = () => {
	NProgress.done();
};

Router.onRouteChangeError = () => {
	NProgress.done();
};

const linkStyle = {
	marginRight: 15
};

class Menu extends Component {

	static propTypes = {
		menu: menuPropTypes
	}

	getSlug(url) {
		const parts = url.split('/');

		return parts.length > 2 ? parts[parts.length - 2] : '';
	}

	getPath(url) {
		const parts = url.split(Config.apiUrl);

		return parts.length > 1 ? parts[1] : '';
	}

	render() {
		const { menu } = this.props;
		let menuItems = [];

		if (menu && menu.items) {
			menuItems = menu.items.map((item, index) => {
				if (item.object === 'custom') {
					return (
						<a href={ item.url } key={ item.ID } style={ linkStyle }>{ item.title }</a>
					);
				}

				const actualPage = item.object === 'category' ? 'category' : 'post';
				const path = this.getPath(item.url);
				const slug = this.getSlug(item.url);

				return (
					<Link
						prefetch
						as={ path }
						href={ `/${actualPage}?id=${item.object_id}&slug=${slug}&apiRoute=${item.object}` }
						key={ item.ID }
					>
						<a style={ linkStyle }>{ item.title }</a>
					</Link>
				);
			});
		}

		return (
			<nav>
				{ menu && menuItems }
			</nav>
		)
	}


}

export default Menu;
