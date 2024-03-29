module.exports = {
	extends: ['stylelint-config-standard'],
	rules: {
		'at-rule-disallowed-list': null,
		'at-rule-empty-line-before': [
			'always',
			{
				except: ['blockless-after-same-name-blockless', 'first-nested'],
				ignore: ['after-comment'],
			},
		],
		'at-rule-no-vendor-prefix': true,
		'at-rule-no-unknown': true,
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
		'function-no-unknown': true,
		'function-url-scheme-allowed-list': null,
		'function-url-no-scheme-relative': true,
		'function-url-quotes': 'always',
		'import-notation': 'string',
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
		'selector-max-specificity': null,
		'selector-max-id': [0, { message: 'スタイル定義でIDセレクタは使わないでください' }],
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
};
