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
		'no-console': 'warn',
		'no-mixed-spaces-and-tabs': 0,
		'no-restricted-syntax': [
			2,
			{
				selector:
					':matches(PropertyDefinition, MethodDefinition)[accessibility="private"]',
				message: 'Use #private instead',
			},
			{
				selector:
					':matches(PropertyDefinition, MethodDefinition)[accessibility="public"]',
				message: 'Remove public keyword',
			},
			{
				selector: 'MethodDefinition[key.name=/^_/]:not([accessibility="protected"])',
				message: 'Add protected keyword',
			},
			{
				selector: 'MethodDefinition:not([key.name=/^_/])[accessibility="protected"]',
				message: 'Start with `_` if you want to use protected',
			},
		],
		'no-unused-vars': 0,
		'no-var': 2,
		'prefer-const': 2,
		'prefer-rest-params': 2,
		'prefer-spread': 2,

		// Unicorn
		'unicorn/consistent-destructuring': 0,
		'unicorn/consistent-function-scoping': 0,
		'unicorn/no-anonymous-default-export': 0,
		'unicorn/no-array-callback-reference': 0,
		'unicorn/no-nested-ternary': 0,
		'unicorn/no-null': 0,
		'unicorn/no-process-exit': 0,
		'unicorn/prefer-query-selector': 0,
		'unicorn/prefer-ternary': 0,
		'unicorn/prevent-abbreviations': 0,
		'unicorn/prefer-string-raw': 0,

		// import
		'import/no-extraneous-dependencies': 2,
		'import/no-named-as-default': 0,
		'import/no-unresolved': 0,
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

		// Sort Class members
		'sort-class-members/sort-class-members': [
			1,
			{
				order: [
					'[public-properties]',
					'[public-readonly-properties]',
					'[public-properties-function]',
					'[private-properties]',
					'[private-properties-function]',
					'[accessor-pairs]',
					'[getters]',
					'[setters]',
					'constructor',
					'[public-methods]',
					'[private-methods]',
					'[protedted-methods]',
					'[static-properties]',
					'[static-methods]',
					'[everything-else]',
				],
				groups: {
					'public-properties': [
						{
							type: 'property',
							kind: 'nonAccessor',
							static: false,
							private: false,
							override: false,
							readonly: false,
							sort: 'alphabetical',
						},
					],
					'public-readonly-properties': [
						{
							type: 'property',
							kind: 'nonAccessor',
							static: false,
							private: false,
							override: false,
							readonly: true,
							sort: 'alphabetical',
						},
					],
					'public-properties-function': [
						{
							type: 'property',
							propertyType: 'ArrowFunctionExpression',
							kind: 'nonAccessor',
							static: false,
							private: false,
							accessibility: 'public',
							override: false,
							sort: 'alphabetical',
						},
					],
					'private-properties': [
						{
							type: 'property',
							kind: 'nonAccessor',
							static: false,
							private: true,
							override: false,
							sort: 'alphabetical',
						},
					],
					'private-properties-function': [
						{
							type: 'property',
							propertyType: 'ArrowFunctionExpression',
							kind: 'nonAccessor',
							static: false,
							private: true,
							accessibility: 'public',
							override: false,
							sort: 'alphabetical',
						},
					],
					'public-methods': [
						{
							type: 'method',
							kind: 'nonAccessor',
							static: false,
							private: false,
							override: false,
							sort: 'alphabetical',
						},
					],
					'private-methods': [
						{
							name: '/#.+/',
							type: 'method',
							kind: 'nonAccessor',
							static: false,
							private: true,
							override: false,
							sort: 'alphabetical',
						},
					],
					'protedted-methods': [
						{
							name: '/_.+/',
							type: 'method',
							static: false,
							sort: 'alphabetical',
						},
					],
				},
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
			files: [
				'*.{test,spec}.{js,mjs,json}',
				'*.config.{js,mjs,json}',
				'.*rc.{js,mjs,json}',
			],
			rules: {
				'import/no-extraneous-dependencies': 0,
			},
		},
	],
};
