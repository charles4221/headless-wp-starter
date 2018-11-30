/* eslint-env node */
/* eslint-disable no-console, no-process-exit */

const express = require('express');
const next = require('next');
const Config = require('./config');
const { api } = require('./utils/Helpers');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/**
 * Get the `pathname` from a url from our WP server.
 *
 * @param {String} url The full url to split.
 * @returns {String} The `pathname`.
 */
const getPath = (url) => {
	const parts = url.split(Config.apiUrl);

	return parts.length > 1 ? `${parts[1]}` : '';
}

// WP API endpoint for getting the WP global settings (e.g. sitename, description, timezone).
const settingsEndpoint = `${Config.apiUrl}/wp-json/`
// WP API endpoint for getting the menu.
const menuEndpoint = `${Config.apiUrl}/wp-json/menus/v1/menus/header-menu`;
// WP API endpoint for getting the array of posts.
const postsEndpoint = `${Config.apiUrl}/wp-json/better-rest-endpoints/v1/posts?content=false`;
// WP API endpoint for getting the array of pages.
const pagesEndpoint = `${Config.apiUrl}/wp-json/better-rest-endpoints/v1/pages?content=false`
// WP API endpoint for getting the ACF Options.
const optionsEndpoint = `${Config.apiUrl}/wp-json/acf/v3/options/headless-settings`

/**
 * Prepare and build our Next App and Express Server.
 */
app
	.prepare()
	.then(async () => {
		const server = express();

		// Asynchronously fetch initial data we need to render the application.
		// Fetching data at this point acts as a cache, in that it is only requested once
		// when the server is started, and cached within the `serverData` constant below.
		// My idea is to add a custom action into the WP `save_post` hook which triggers
		// the Node server to reload, therefore refreshing the cached data below - CH.
		const getServerData = async () => {
			console.log('Node Server getting WP API data...');

			const globalSettings = await api(settingsEndpoint).then((response) => response);
			const menu = await api(menuEndpoint).then((response) => response);
			const posts = await api(postsEndpoint).then((response) => response);
			const pages = await api(pagesEndpoint).then((response) => response);
			const options = await api(optionsEndpoint).then((response) => response);

			const { name, description, url, home } = globalSettings; // eslint-disable-line camelcase
			const settings = {
				name,
				description,
				url,
				home
			};

			console.log('Node Server finished getting WP API data!');

			return {
				settings,
				menu,
				posts,
				pages,
				options
			};
		}

		const serverData = await getServerData();

		// Explicitly create server routes for each post and page from the API.

		await serverData.posts.forEach((post) =>
			server.get(getPath(post.permalink), (req, res) => {
				const actualPage = '/post';
				const queryParams = {
					id: post.id,
					slug: post.slug,
					apiRoute: 'post',
					menu: serverData.menu,
					settings: serverData.settings,
					options: serverData.options.acf
				}

				app.render(req, res, actualPage, queryParams);
			})
		);

		await serverData.pages.forEach((page) =>
			server.get(getPath(page.permalink), (req, res) => {
				const actualPage = '/post';
				const queryParams = {
					id: page.id,
					slug: page.slug,
					apiRoute: 'page',
					menu: serverData.menu,
					settings: serverData.settings,
					options: serverData.options.acf
				}

				app.render(req, res, actualPage, queryParams);
			})
		);

		// Category taxonomy indexes.

		server.get('/category/:slug', (req, res) => {
			const actualPage = '/category';
			const queryParams = {
				slug: req.params.slug,
				menu: serverData.menu,
				settings: serverData.settings,
				options: serverData.options.acf
			};

			app.render(req, res, actualPage, queryParams);
		});

		// Preview links from WP Admin.

		server.get('/_preview/:id/:wpnonce', (req, res) => {
			const actualPage = '/preview';
			const queryParams = {
				id: req.params.id,
				wpnonce: req.params.wpnonce,
				menu: serverData.menu,
				settings: serverData.settings,
				options: serverData.options.acf
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
