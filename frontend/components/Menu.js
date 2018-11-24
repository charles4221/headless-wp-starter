import React, { Component } from 'react';
import Link from 'next/link';
import { Config } from '../config.js';

const linkStyle = {
	marginRight: 15
};

class Menu extends Component {

	getSlug(url) {
		const parts = url.split('/');

		return parts.length > 2 ? parts[parts.length - 2] : '';
	}

	getPath(url) {
		const parts = url.split(Config.apiUrl);

		return parts.length > 1 ? `${parts[1]}` : '';
	}

	render() {
		const menuItems = this.props.menu.items.map((item, index) => {
			if (item.object === 'custom') {
				return (
					<Link prefetch href={ item.url } key={ item.ID }>
						<a style={ linkStyle }>{ item.title }</a>
					</Link>
				);
			}
			const path = this.getPath(item.url);
			const slug = this.getSlug(item.url);
			const actualPage = item.object === 'category' ? 'category' : 'post';


			return (
				<Link
					prefetch
					as={ path }
					href={ `/${actualPage}?slug=${slug}&apiRoute=${item.object}` }
					key={ item.ID }
				>
					<a style={ linkStyle }>{ item.title }</a>
				</Link>
			);
		});


		return (
			<div>
				<Link href="/">
					<a style={ linkStyle }>Home</a>
				</Link>
				{ menuItems }
			</div>
		)
	}


}

export default Menu;
