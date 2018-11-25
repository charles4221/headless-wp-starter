/* eslint-env node */
/* eslint-disable no-console, no-process-exit */

const express = require('express');
const next = require('next');
const fetch = require('isomorphic-unfetch');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const Config = { apiUrl: 'https://react.harwooddigital.com.au' };

const getPath = (url) => {
	const parts = url.split(Config.apiUrl);

	return parts.length > 1 ? `${parts[1]}` : '';
}

app
	.prepare()
	.then(async () => {
		const server = express();

		const getServerData = async () => {
			const postsRes = await fetch(
				`${Config.apiUrl}/wp-json/better-rest-endpoints/v1/posts?content=false`
			);
			const posts = await postsRes.json();
			const pagesRes = await fetch(
				`${Config.apiUrl}/wp-json/better-rest-endpoints/v1/pages?content=false`
			);
			const pages = await pagesRes.json();

			return {
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
					slug: post.slug,
					apiRoute: 'post'
				}

				app.render(req, res, actualPage, queryParams);
			})
		})

		serverData.pages.forEach((page) => {
			server.get(getPath(page.permalink), (req, res) => {
				const actualPage = '/post';
				const queryParams = {
					slug: page.slug,
					apiRoute: 'page'
				}

				app.render(req, res, actualPage, queryParams);
			})
		});

		// Default fallbacks.

		server.get('/post/:slug', (req, res) => {
			const actualPage = '/post';
			const queryParams = {
				slug: req.params.slug,
				apiRoute: 'post'
			};

			app.render(req, res, actualPage, queryParams);
		});

		server.get('/page/:slug', (req, res) => {
			console.log(req.params);

			const actualPage = '/post';
			const queryParams = {
				slug: req.params.slug,
				apiRoute: 'page'
			};

			app.render(req, res, actualPage, queryParams);
		});

		server.get('/category/:slug', (req, res) => {
			const actualPage = '/category';
			const queryParams = { slug: req.params.slug };

			app.render(req, res, actualPage, queryParams);
		});

		// Preview links.

		server.get('/_preview/:id/:wpnonce', (req, res) => {
			const actualPage = '/preview';
			const queryParams = { id: req.params.id,
				wpnonce: req.params.wpnonce };

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
