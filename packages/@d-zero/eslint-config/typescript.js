import tsESLint from 'typescript-eslint';

import { base } from './base.js';

export const ts = tsESLint.config(
	base,
	tsESLint.configs.recommended,
	{
		files: ['*.{ts,tsx}', '**/*.{ts,tsx}'],
		languageOptions: {
			parserOptions: {
				sourceType: 'module',
				project: ['./tsconfig.json'],
			},
		},
		settings: {
			'import-x/parsers': {
				'@typescript-eslint/parser': ['.ts'],
			},
		},
		rules: {
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
);
