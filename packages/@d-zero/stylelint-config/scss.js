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
		'no-invalid-position-at-import-rule': [
			true,
			{
				ignoreAtRules: ['use'],
			},
		],
	},
};
