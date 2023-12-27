const base = require('./base');

/**
 * @type {import('eslint/lib/shared/types').ConfigData}
 */
module.exports = {
	...base,
	overrides: [
		{
			files: '**/*.{ts,tsx}',
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
				'@typescript-eslint/no-unused-vars': 2,
				'@typescript-eslint/no-array-constructor': 2,
				'@typescript-eslint/adjacent-overload-signatures': 2,
				'@typescript-eslint/no-namespace': [2, { allowDeclarations: true }],
				'@typescript-eslint/prefer-namespace-keyword': 2,
				'@typescript-eslint/no-var-requires': 2,
				'@typescript-eslint/no-unnecessary-type-assertion': 2,
				'@typescript-eslint/restrict-plus-operands': 0,
				'@typescript-eslint/consistent-type-imports': 1,
				'@typescript-eslint/require-await': 2,
				'@typescript-eslint/no-floating-promises': 2,
				'@typescript-eslint/member-ordering': [
					'warn',
					{
						default: 'never',
						classes: {
							memberTypes: [
								'public-static-field',
								'protected-static-field',
								'private-static-field',
								'public-static-method',
								'protected-static-method',
								'public-static-get',
								'protected-static-get',
								'private-static-get',
								'public-instance-field',
								'protected-instance-field',
								'private-instance-field',
								'public-abstract-field',
								'protected-abstract-field',
								'public-constructor',
								'protected-constructor',
								'private-constructor',
								['public-abstract-get', 'public-abstract-set'],
								['protected-abstract-get', 'protected-abstract-set'],
								['public-instance-get', 'public-instance-set'],
								['protected-instance-get', 'protected-instance-set'],
								['private-instance-get', 'private-instance-set'],
								'public-abstract-method',
								'protected-abstract-method',
								'public-instance-method',
								'protected-instance-method',
								'private-instance-method',
								'private-static-method',
							],
							order: 'alphabetically',
						},
					},
				],
			},
		},
	],
};
