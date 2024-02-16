module.exports = {
	rules: {
		'declaration-property-value-disallowed-list': {
			'/^(?:color|background|background-color|border|border-color|outline|outline-color)$/':
				['/#[0-9a-f]{3}/', '/(?:rgb|hsl)a?\\(.+?\\)/'],
			content: ['/^\\"\\\\[0-9a-fA-F]{1,6}\\"$/'],
			flex: ['/calc/'],
			'/^(?:max-|min-)?(?:width|height)|^flex/': [
				'/[1-9]*\\.[0-9]+(?:%|vw|vh)/',
				'/(?:^|[^0-9])[0-9](?:%|vw|vh)/',
				'/(?:^|[^0-9])[0-9]{2}(?:%|vw|vh)/',
				'/1[0-9][1-9](?:%|vw|vh)/',
				'/1[1-9][0-9](?:%|vw|vh)/',
				'/[2-9][0-9][0-9](?:%|vw|vh)/',
				'/[0-9]{4,}(?:%|vw|vh)/',
			],
		},
		'declaration-property-value-allowed-list': {
			'font-size': [
				'inherit',
				'$root-font-size',
				'$base-font-size',
				'1em',
				'/^calc\\(\\s*(?:\\$[a-z_][a-z0-9_-]*|(?:[0-9]*\\.)?[0-9]+) \\/ (?:\\$[a-z_][a-z0-9_-]*|(?:[0-9]*\\.)?[0-9]+) \\* (?:1em|100vw)\\s*\\)$/',
				'/^(?:[0-9]*\\.)?[0-9]+rem/',
				'/^clamp\\(/',
			],
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
				ignoreProperties: ['/^\\$font-family-/'],
			},
		],
	},
};
