/**
 * @see https://drafts.csswg.org/css-values-4/#viewport-relative-lengths
 */
const VIEWPORT_PERCENTAGE_LENGTHS = '[ls]?v(?:w|h|i|d|max|min)';

const PERCENTATE_UNITS = `(?:%|${VIEWPORT_PERCENTAGE_LENGTHS})`;

module.exports = {
	plugins: ['@d-zero/stylelint-rules'],
	rules: {
		'declaration-property-value-disallowed-list': {
			'/^(?:color|background|background-color|border|border-color|outline|outline-color)$/':
				['/#[0-9a-f]{3}/', String.raw`/(?:rgb|hsl)a?\(.+?\)/`],
			content: [String.raw`/^\"\\[0-9a-fA-F]{1,6}\"$/`],
		},
		'declaration-property-value-allowed-list': {
			'font-size': [
				'inherit',
				'/^\\$[a-z][a-z0-9]*-font-size(-[a-z0-9]+)?$/',
				'1em',
				String.raw`/^calc\(\s*(?:\$[a-z_][a-z0-9_-]*|(?:[0-9]*\.)?[0-9]+) \/ (?:\$[a-z_][a-z0-9_-]*|(?:[0-9]*\.)?[0-9]+) \* (?:1em|100vw)\s*\)$/`,
				String.raw`/^(?:[0-9]*\.)?[0-9]+rem/`,
				String.raw`/^clamp\(/`,
				// Custom properties
				String.raw`/^var\(/`,
			],
			flex: [
				String.raw`/^\s*[01]\s+[01]\s.+/`,
				// Custom properties
				String.raw`/^var\(/`,
			],
			'flex-grow': ['0', '1'],
			'flex-shrink': ['0', '1'],
		},
		'unit-disallowed-list': [
			'ex',
			'ch',
			'mm',
			'q',
			'cm',
			'in',
			'pt',
			'pc',
			'vm',
			's',
			'grad',
			'rad',
			'turn',
		],
		'value-keyword-case': [
			'lower',
			{
				ignoreProperties: [String.raw`/^\$font-family-/`],
			},
		],

		'@d-zero/declaration-value-type-disallowed-list': {
			'/^length|percentage$/': {
				ignoreProperties: ['font-size'],
				patterns: [
					// float
					`/[1-9]*\\.[0-9]+${PERCENTATE_UNITS}/`,

					// 1% - 99%
					`/[1-9][0-9]?${PERCENTATE_UNITS}/`,

					// 101% - 199%
					`/1[0-9][1-9]${PERCENTATE_UNITS}/`,
					`/1[1-9][0-9]${PERCENTATE_UNITS}/`,

					// 200% - 999%
					`/[2-9][0-9][0-9]${PERCENTATE_UNITS}/`,

					// 1000% or larger
					`/[1-9][0-9]{3,}${PERCENTATE_UNITS}/`,
				],
			},
		},
	},
};
