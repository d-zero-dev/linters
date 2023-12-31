module.exports = {
	extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
	plugins: ['stylelint-scss', 'stylelint-order'],
	rules: {
		'order/order': [
			'dollar-variables',
			'custom-properties',
			{
				type: 'at-rule',
				name: 'custom-media',
			},
			{
				type: 'at-rule',
				name: 'extend',
			},
			{
				type: 'at-rule',
				name: 'mixin',
			},
			'declarations',
			{
				type: 'at-rule',
				name: 'supports',
			},
			{
				type: 'at-rule',
				name: 'media',
				hasBlock: true,
			},
			'rules',
		],
		'at-rule-disallowed-list': null,
		'at-rule-empty-line-before': [
			'always',
			{
				except: ['blockless-after-same-name-blockless', 'first-nested'],
				ignore: ['after-comment'],
			},
		],
		'at-rule-no-vendor-prefix': true,
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: ['mixin', 'extend', 'for', 'if', 'include', 'use', 'forward'],
			},
		],
		'color-hex-length': 'short',
		'color-named': 'never',
		'color-no-invalid-hex': true,
		'comment-empty-line-before': [
			'always',
			{
				ignore: ['stylelint-commands'],
			},
		],
		'comment-no-empty': true,
		'comment-whitespace-inside': 'always',
		'comment-word-disallowed-list': ['/^TODO:/'],
		'custom-property-empty-line-before': 'never',
		'declaration-block-no-duplicate-properties': true,
		'declaration-block-no-redundant-longhand-properties': true,
		'declaration-block-no-shorthand-property-overrides': true,
		'declaration-block-single-line-max-declarations': 80,
		'declaration-empty-line-before': 'never',
		'declaration-no-important': true,
		'declaration-property-value-disallowed-list': null,
		'declaration-property-value-allowed-list': null,
		'font-family-name-quotes': 'always-where-required',
		'font-family-no-duplicate-names': true,
		'font-weight-notation': 'named-where-possible',
		'function-disallowed-list': null,
		'function-calc-no-unspaced-operator': true,
		'function-linear-gradient-no-nonstandard-direction': true,
		'function-name-case': 'lower',
		'function-no-unknown': [
			true,
			{
				ignoreFunctions: ['a', 'lighten', 'darken', 'resolve'],
			},
		],
		'function-url-scheme-allowed-list': null,
		'function-url-no-scheme-relative': true,
		'function-url-quotes': 'always',
		'keyframe-declaration-no-important': true,
		'length-zero-no-unit': true,
		'max-nesting-depth': 8,
		'media-feature-name-no-unknown': true,
		'media-feature-name-no-vendor-prefix': true,
		'no-duplicate-selectors': true,
		'no-descending-specificity': null,
		'no-empty-source': true,
		'no-invalid-double-slash-comments': true,
		'no-unknown-animations': true,
		'number-max-precision': 4,
		'property-disallowed-list': null,
		'property-no-unknown': true,
		'property-no-vendor-prefix': [
			true,
			{
				severity: 'warning',
				message: 'Autoprefixerを利用するのでベンダープレフィックスは不要です',
			},
		],
		'rule-empty-line-before': [
			'always-multi-line',
			{
				except: ['after-single-line-comment', 'first-nested'],
				ignore: ['after-comment'],
			},
		],
		'selector-attribute-operator-disallowed-list': null,
		'selector-attribute-quotes': 'always',
		'selector-max-compound-selectors': 8,
		'selector-max-specificity': '0,10,10',
		'selector-max-id': 0,
		'selector-max-universal': 1,
		'selector-no-vendor-prefix': true,
		'selector-pseudo-class-disallowed-list': ['link'],
		'selector-pseudo-element-colon-notation': 'double',
		'selector-type-case': 'lower',
		'selector-type-no-unknown': true,
		'shorthand-property-no-redundant-values': null,
		'string-no-newline': true,
		'time-min-milliseconds': 100,
		'unit-disallowed-list': null,
		'unit-no-unknown': true,
		'value-keyword-case': null,
		'value-no-vendor-prefix': true,

		// Overwrite stylelint-config-standard
		'custom-media-pattern': null,
		'custom-property-pattern': null,
		'selector-class-pattern': null,
	},
	overrides: [
		{
			files: ['__assets/**/*.scss'],
			customSyntax: 'postcss-scss',
		},
	],
};
