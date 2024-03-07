const base = require('./base');

/**
 * @type {import('eslint/lib/shared/types').ConfigData}
 */
module.exports = {
	...base,
	overrides: [
		...base.overrides,
		{
			files: ['*.{ts,tsx}', '**/*.{ts,tsx}'],
			extends: ['plugin:import/typescript', 'plugin:@typescript-eslint/recommended'],
			plugins: ['@typescript-eslint', ...base.plugins],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				sourceType: 'module',
				project: ['./tsconfig.json'],
			},
			settings: {
				...base.settings,
				'import/parsers': {
					'@typescript-eslint/parser': ['.ts'],
				},
			},
			rules: {
				...base.rules,
				// @typescript-eslint
				'@typescript-eslint/adjacent-overload-signatures': 2,
				'@typescript-eslint/ban-ts-comment': 0,
				'@typescript-eslint/consistent-type-imports': 1,
				'@typescript-eslint/member-ordering': 0,
				'@typescript-eslint/no-array-constructor': 2,
				'@typescript-eslint/no-explicit-any': [1, { fixToUnknown: true }],
				'@typescript-eslint/no-floating-promises': 2,
				'@typescript-eslint/no-namespace': [2, { allowDeclarations: true }],
				'@typescript-eslint/no-unnecessary-type-assertion': 2,
				'@typescript-eslint/no-unused-vars': 2,
				'@typescript-eslint/no-var-requires': 2,
				'@typescript-eslint/prefer-namespace-keyword': 2,
				'@typescript-eslint/require-await': 2,
				'@typescript-eslint/restrict-plus-operands': 0,
			},
		},
		{
			files: ['*.{test,spec}.{ts,mts,tsx}'],
			rules: {
				'import/no-extraneous-dependencies': 0,
			},
		},
	],
};
