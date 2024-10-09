export default {
	extends: ['markuplint:recommended-static-html'],
	nodeRules: [
		{
			selector: "script[src^='https://'], script[src^='https://']",
			rules: {
				'required-attr': false,
			},
		},
	],
};
