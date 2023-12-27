/**
 * @type {import('eslint/lib/shared/types').ConfigData}
 */
module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:unicorn/recommended',
		'plugin:regexp/recommended',
		'plugin:import/recommended',
	],
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	plugins: ['unicorn', 'jsdoc', 'eslint-comments', 'import', 'sort-class-members'],
	parserOptions: {
		ecmaVersion: 2023,
	},
	globals: {
		NodeJS: true,
	},
	rules: {
		// Standard
		'no-var': 2,
		'no-unused-vars': 0,
		'no-console': 'warn',
		'no-mixed-spaces-and-tabs': 0,
		'prefer-const': 2,
		'prefer-rest-params': 2,
		'prefer-spread': 2,

		// Unicorn
		'unicorn/consistent-destructuring': 0,
		'unicorn/consistent-function-scoping': 0,
		'unicorn/no-array-callback-reference': 0,
		'unicorn/no-nested-ternary': 0,
		'unicorn/no-null': 0,
		'unicorn/prefer-query-selector': 0,
		'unicorn/prefer-ternary': 0,
		'unicorn/prevent-abbreviations': 0,

		// import
		'import/no-named-as-default': 0,
		'import/no-unresolved': 0,
		'import/no-extraneous-dependencies': 2,
		'import/order': [
			2,
			{
				groups: ['type', 'builtin', 'external', 'parent', 'sibling', 'index', 'object'],
				pathGroups: [
					{
						pattern: '@alias/**',
						group: 'parent',
						position: 'before',
					},
				],
				alphabetize: {
					order: 'asc',
				},
				'newlines-between': 'always',
			},
		],

		// sort-class-members
		'sort-class-members/sort-class-members': [
			1,
			{
				order: [
					'[static-properties]',
					'[static-methods]',
					'[properties]',
					'[conventional-private-properties]',
					'constructor',
					'[methods]',
					'[conventional-private-methods]',
				],
				accessorPairPositioning: 'getThenSet',
			},
		],
	},
	settings: {
		jsdoc: {
			tagNamePreference: {
				param: 'arg',
				returns: 'return',
			},
		},
	},
	overrides: [
		{
			files: '**/*.spec.*',
			rules: {
				'import/no-extraneous-dependencies': 0,
			},
		},
		{
			files: ['*.config.{js,mjs,json,ts}', '.*rc.{js,mjs,json,ts}'],
			rules: {
				'import/no-extraneous-dependencies': 0,
			},
		},
	],
};
