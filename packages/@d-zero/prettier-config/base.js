export default {
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
	overrides: [
		{
			files: '.*rc',
			options: { parser: 'json' },
		},
		{
			files: '*.html',
			options: {
				printWidth: 100_000,
			},
		},
		{
			files: '*.mdc',
			options: { parser: 'markdown' },
		},
		{
			files: '.clinerules',
			options: { parser: 'markdown' },
		},
	],
};
