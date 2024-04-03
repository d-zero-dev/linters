export default {
	extends: ['markuplint:recommended'],
	rules: {
		'character-reference': false,
	},
	nodeRules: [
		{
			selector: "script[src^='https://']",
			rules: {
				'required-attr': false,
			},
		},
	],
};
