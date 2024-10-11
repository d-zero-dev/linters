export default {
	plugins: ['@prettier/plugin-pug'],

	arrowParens: 'always',
	bracketSameLine: true,
	bracketSpacing: true,
	jsxSingleQuote: false,
	printWidth: 90,
	quoteProps: 'as-needed',
	semi: true,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'all',
	useTabs: true,

	pugAttributeSeparator: 'as-needed',
	pugCommentPreserveSpaces: 'trim-all',
	pugEmptyAttributes: 'none',
	pugSingleQuote: false,
	pugSortAttributesBeginning: ['class'],
	pugSortAttributesEnd: ['id'],

	overrides: [
		{
			files: '.*rc',
			options: { parser: 'json' },
		},
		{
			files: '.html',
			options: {
				printWidth: 100_000,
			},
		},
	],
};
