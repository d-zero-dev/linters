export default {
	extends: ['markuplint:recommended-static-html'],
	nodeRules: [
		{
			selector: "script[src^='https://'], script[src^='https://']",
			rules: {
				'required-attr': false,
			},
		},
		{
			selector: 'html',
			rules: {
				// <html prefix="og: http://ogp.me/ns#">
				'invalid-attr': {
					options: {
						allowAttrs: [
							{
								name: 'prefix',
								value: 'Any',
							},
						],
					},
				},
			},
		},
	],
};
