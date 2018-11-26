/* eslint-env node */
/* eslint-disable no-console, no-process-exit */

const express = require('express');
const next = require('next');
const fetch = require('isomorphic-unfetch');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const Config = require('./config');

const getPath = (url) => {
	const parts = url.split(Config.apiUrl);

	return parts.length > 1 ? `${parts[1]}` : '';
}

app
	.prepare()
	.then(async () => {
		const server = express();

		// Asynchronously fetch initial data we need to render the application.

		const getServerData = async () => {
			const menuRes = await fetch(
				`${Config.apiUrl}/wp-json/menus/v1/menus/header-menu`
			);
			const menu = await menuRes.json();
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
				posts,
				pages
			};
		}

		const serverData = await getServerData();

		// Explicitly create server routes for each post and page from the API.

		serverData.posts.forEach((post) => {
			server.get(getPath(post.permalink), (req, res) => {
				const actualPage = '/post';
				const queryParams = {
					id: post.id,
					slug: post.slug,
					apiRoute: 'post',
					menu: serverData.menu
				}

				app.render(req, res, actualPage, queryParams);
			})
		})

		serverData.pages.forEach((page) => {
			server.get(getPath(page.permalink), (req, res) => {
				const actualPage = '/post';
				const queryParams = {
					id: page.id,
					slug: page.slug,
					apiRoute: 'page',
					menu: serverData.menu
				}

				app.render(req, res, actualPage, queryParams);
			})
		});

		// Category taxonomy indexes.

		server.get('/category/:slug', (req, res) => {
			const actualPage = '/category';
			const queryParams = {
				slug: req.params.slug,
				menu: serverData.menu
			};

			app.render(req, res, actualPage, queryParams);
		});

		// Preview links from WP Admin.

		server.get('/_preview/:id/:wpnonce', (req, res) => {
			const actualPage = '/preview';
			const queryParams = {
				id: req.params.id,
				wpnonce: req.params.wpnonce,
				menu: serverData.menu
			};

			app.render(req, res, actualPage, queryParams);
		});

		// Handle all other requests.

		server.get('*', (req, res) => handle(req, res));

		server.listen(3000, (err) => {
			if (err) {
				throw err;
			}
			console.log('> Ready on http://localhost:3000');
		});
	})
	.catch((ex) => {
		console.error(ex.stack);
		process.exit(1);
	});
