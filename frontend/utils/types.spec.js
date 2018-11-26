import PropTypes from 'prop-types';

export const childComponentTypes = PropTypes.oneOfType([
	PropTypes.element,
	PropTypes.arrayOf(PropTypes.element)
]);

/* eslint-disable camelcase */

export const menuPropTypes = PropTypes.exact({
	count: PropTypes.number,
	description: PropTypes.string,
	filter: PropTypes.string,
	items: PropTypes.arrayOf(
		PropTypes.exact({
			ID: PropTypes.number.isRequired,
			attr_title: PropTypes.string,
			classes: PropTypes.arrayOf(PropTypes.string),
			comment_count: PropTypes.string,
			comment_status: PropTypes.string,
			db_id: PropTypes.number,
			description: PropTypes.string,
			filter: PropTypes.string,
			guid: PropTypes.string,
			menu_item_parent: PropTypes.string,
			menu_order: PropTypes.number,
			object: PropTypes.string.isRequired,
			object_id: PropTypes.string.isRequired,
			ping_status: PropTypes.string,
			pinged: PropTypes.string,
			post_author: PropTypes.string,
			post_content: PropTypes.string,
			post_content_filtered: PropTypes.string,
			post_date: PropTypes.string,
			post_date_gmt: PropTypes.string,
			post_excerpt: PropTypes.string,
			post_mime_type: PropTypes.string,
			post_modified: PropTypes.string,
			post_modified_gmt: PropTypes.string,
			post_name: PropTypes.string,
			post_parent: PropTypes.number,
			post_password: PropTypes.string,
			post_status: PropTypes.string,
			post_title: PropTypes.string,
			post_type: PropTypes.string,
			target: PropTypes.string,
			title: PropTypes.string.isRequired,
			to_ping: PropTypes.string,
			type: PropTypes.string,
			type_label: PropTypes.string,
			url: PropTypes.string.isRequired,
			xfn: PropTypes.string
		})
	).isRequired,
	name: PropTypes.string,
	parent: PropTypes.number,
	slug: PropTypes.string,
	taxonomy: PropTypes.string,
	term_group: PropTypes.number,
	term_id: PropTypes.number,
	term_taxonomy_id: PropTypes.number
}).isRequired;

export const postPropTypes = PropTypes.shape({
	acf: PropTypes.shape({
		flexible_layout: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.arrayOf(PropTypes.shape({
				acf_fc_layout: PropTypes.string
			}))
		])
	}),
	author: PropTypes.string,
	author_id: PropTypes.number,
	author_nicename: PropTypes.string,
	category_ids: PropTypes.arrayOf(PropTypes.number),
	category_names: PropTypes.arrayOf(PropTypes.string),
	content: PropTypes.string.isRequired,
	date: PropTypes.string,
	excerpt: PropTypes.string,
	id: PropTypes.number.isRequired,
	media: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.object
	]),
	parent: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.string
	]),
	permalink: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
	tag_ids: PropTypes.arrayOf(PropTypes.number),
	tag_names: PropTypes.arrayOf(PropTypes.string),
	template: PropTypes.string,
	title: PropTypes.string.isRequired,
	yoast: PropTypes.object
}).isRequired;
