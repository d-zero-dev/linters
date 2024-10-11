module.exports = {
	customSyntax: 'postcss-scss',
	plugins: ['stylelint-scss'],
	rules: {
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: ['mixin', 'extend', 'for', 'if', 'include', 'use', 'forward'],
			},
		],
	},
};
