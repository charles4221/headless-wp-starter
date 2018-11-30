import React, { Component } from 'react';
import Head from 'next/head';
import { postPropTypes } from '../utils/types.spec';

class Yoast extends Component {

	static propTypes = {
		...postPropTypes.isRequired
	};

	renderOpenGraph() {
		const { settings, yoast } = this.props;

		return (
			<>
				{/* TODO: set the actual locale - CH */}
				<meta property="og:locale" content="en_US" />
				<meta property="og:type" content="article" />
				{ yoast['yoast_wpseo_opengraph-title'] &&
					<meta property="og:title" content={ yoast['yoast_wpseo_opengraph-title'] } />
				}
				{ yoast['yoast_wpseo_opengraph-description'] &&
					<meta property="og:description" content={ yoast['yoast_wpseo_opengraph-description'] } />
				}
				<meta property="og:url" content={
					yoast.yoast_wpseo_canonical
						? yoast.yoast_wpseo_canonical
						: this.props.permalink
				} />
				{ settings.name &&
					<meta property="og:site_name" content={ settings.name } />
				}
				{ yoast['yoast_wpseo_opengraph-image'] &&
					<>
						<meta property="og:image" content={ yoast['yoast_wpseo_opengraph-image'] } />
						<meta property="og:image:secure_url" content={ yoast['yoast_wpseo_opengraph-image'].replace('http://', 'https://') } />
					</>
				}
			</>
		)
	}

	renderTwitterCard() {
		const { yoast } = this.props;

		return (
			<>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={ yoast['yoast_wpseo_twitter-title'] } />
				<meta name="twitter:description" content={ yoast['yoast_wpseo_twitter-description'] } />
				<meta name="twitter:image" content={ yoast['yoast_wpseo_twitter-image'] } />
			</>
		)
	}

	render() {
		const { settings, yoast } = this.props;

		const noindex = yoast['yoast_wpseo_meta-robots-noindex'] === '1';
		const nofollow = yoast['yoast_wpseo_meta-robots-nofollow'] === '1';

		return (
			<Head>
				{ yoast.yoast_wpseo_title
					? <title>{ yoast.yoast_wpseo_title }</title>
					: <title>{ this.props.title }</title>
				}
				{ yoast.yoast_wpseo_metadesc
					? <meta name="description" content={ yoast.yoast_wpseo_metadesc } />
					: <meta name="description" content={ settings.description } />
				}
				{ (noindex || nofollow) &&
					<meta name="robots" content={
						`${noindex ? 'noindex' : ''},${nofollow ? 'nofollow' : ''}`
					} />
				}
				{ yoast['yoast_wpseo_opengraph-title'] &&
					this.renderOpenGraph()
				}
				{ yoast['yoast_wpseo_twitter-title'] &&
					this.renderTwitterCard()
				}
				{ this.props.categoryNames && this.props.categoryNames.length > 0 &&
					<meta property="article:section" content={ this.props.categoryNames[0] } />
				}
				{ this.props.date &&
					<meta property="article:published_time" content={ this.props.date } />
				}
				{ this.props.date_modified &&
					<meta property="article:modified_time" content={ this.props.date_modified } />
				}
				{ yoast.yoast_wpseo_metakeywords &&
					<meta name="keywords" content={ yoast.yoast_wpseo_metakeywords } />
				}
			</Head>
		);
	}

}

export default Yoast;
