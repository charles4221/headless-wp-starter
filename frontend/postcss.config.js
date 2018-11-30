module.exports = {
	plugins: [
		require('postcss-easy-import')({ prefix: '_' }), // keep this first
		require('autoprefixer')({
			browsers: [
				// Guerrilla general browser support policy.
				'Chrome >= 45', // Exact version number here is kinda arbitrary
				'Firefox ESR',
				// Note: Edge versions in Autoprefixer & Can I Use refer to the EdgeHTML rendering engine version,
				// NOT the Edge app version shown in Edge's "About" screen.
				// For example, at the time of writing, Edge 20 on an up-to-date system uses EdgeHTML 12.
				// @see https://github.com/Fyrd/caniuse/issues/1928
				'Edge >= 12',
				'Explorer >= 10',
				// Out of leniency, we prefix these 2 versions further back than the official policy.
				'iOS >= 9',
				'Safari >= 9',
				// The following remain NOT officially supported, but we're lenient and include their prefixes to avoid severely breaking in them.
				'Android >= 4.4',
				'Opera >= 30'
			],
			flexbox: 'no-2009'
		}) // so imports are auto-prefixed too
	]
}
