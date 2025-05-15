import js from '@eslint/js';
import comments from 'eslint-plugin-eslint-comments';
import { flatConfigs as importX } from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import * as regexpPlugin from 'eslint-plugin-regexp';
import sortClassMembers from 'eslint-plugin-sort-class-members';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

/**
 * @type {import('eslint').Linter.Config[]}
 */
export const base = [
	{
		...js.configs.recommended,
		rules: {
			...js.configs.recommended.rules,
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
				{
					selector:
						"CallExpression[callee.property.name='addEventListener'][arguments.0.value='DOMContentLoaded']",
					message:
						"Avoid using 'DOMContentLoaded'. Use 'defer' or 'type=module' attribute instead.",
				},
			],
			'no-unused-vars': 0,
			'no-var': 2,
			'prefer-const': 2,
			'prefer-rest-params': 2,
			'prefer-spread': 2,
		},
	},
	{
		...eslintPluginUnicorn.configs.recommended,
		rules: {
			...eslintPluginUnicorn.configs.recommended.rules,
			'unicorn/consistent-destructuring': 0,
			'unicorn/consistent-function-scoping': 0,
			'unicorn/no-anonymous-default-export': 0,
			'unicorn/no-array-callback-reference': 0,
			'unicorn/no-nested-ternary': 0,
			'unicorn/no-null': 0,
			'unicorn/no-process-exit': 0,
			'unicorn/prefer-global-this': 0,
			'unicorn/prefer-query-selector': 0,
			'unicorn/prefer-string-raw': 0,
			'unicorn/prefer-ternary': 0,
			'unicorn/prevent-abbreviations': 0,
		},
	},
	regexpPlugin.configs['flat/recommended'],
	{
		...importX.recommended,
		rules: {
			...importX.recommended.rules,
			'import-x/no-extraneous-dependencies': 2,
			'import-x/no-named-as-default': 0,
			'import-x/no-unresolved': 0,
			'import-x/order': [
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
		},
	},
	{
		files: [
			'*.{test,spec}.{js,mjs,json}',
			'*.config.{js,mjs,json}',
			'.*rc.{js,mjs,json}',
		],
		rules: {
			'import-x/no-extraneous-dependencies': 0,
		},
	},
	{
		...jsdoc.configs['flat/recommended'],
		rules: {
			...jsdoc.configs['flat/recommended'].rules,
			'jsdoc/require-param-type': 0,
			'jsdoc/require-param-description': 0,
			'jsdoc/require-returns': 0,
			'jsdoc/require-returns-type': 0,
			'jsdoc/require-returns-description': 0,
		},
	},
	{
		plugins: {
			comments,
		},
	},
	{
		plugins: {
			comments,
			'sort-class-members': sortClassMembers,
		},
		rules: {
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
	},
	{
		languageOptions: {
			ecmaVersion: 2023,
			globals: {
				...globals.builtin,
				...globals.nodeBuiltin,
			},
		},
	},
];
