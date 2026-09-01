import oxlintConfig from '@d-zero/oxlint-config';
import js from '@eslint/js';
import comments from 'eslint-plugin-eslint-comments';
import { flatConfigs as importX } from 'eslint-plugin-import-x';
import { configs as jsdocConfigs } from 'eslint-plugin-jsdoc';
import oxlintPlugin from 'eslint-plugin-oxlint';
import * as regexpPlugin from 'eslint-plugin-regexp';
import sortClassMembers from 'eslint-plugin-sort-class-members';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

import { restrictedSyntax } from './restricted-syntax.js';

/**
 * @type {import('eslint').Linter.Config[]}
 */
export const base = [
	{
		ignores: ['**/*.{ts,mts,cts,tsx}'],
	},
	{
		...js.configs.recommended,
		rules: {
			...js.configs.recommended.rules,
			'no-mixed-spaces-and-tabs': 0,
			'no-restricted-syntax': [2, ...restrictedSyntax],
		},
	},
	{
		...eslintPluginUnicorn.configs.recommended,
	},
	{
		rules: {
			// Repo style choices predating the Oxlint migration — not oxlint-overlap
			// suppressions, so keep these off even though both linters enable them by default.
			'unicorn/no-null': 0,
			'unicorn/prefer-ternary': 0,
			'unicorn/prevent-abbreviations': 0,
			'unicorn/no-nested-ternary': 0,
			'unicorn/consistent-destructuring': 0,
			'unicorn/no-array-callback-reference': 0,
			'unicorn/prefer-global-this': 0,
			'unicorn/prefer-query-selector': 0,
			'unicorn/consistent-function-scoping': 0,
			'unicorn/no-anonymous-default-export': 0,
			'unicorn/prefer-string-raw': 0,
		},
	},
	{
		...regexpPlugin.configs['flat/recommended'],
	},
	{
		...importX.recommended,
		rules: {
			...importX.recommended.rules,
			// `import-x` isn't recognized by `eslint-plugin-oxlint`'s `buildFromOxlintConfig`
			// (it maps oxlint's `import` scope to the `import/` prefix, not `import-x/`), so
			// these overlaps with `@d-zero/oxlint-config` stay disabled manually.
			'import-x/default': 0,
			'import-x/namespace': 0,
			'import-x/no-duplicates': 0,
			'import-x/no-extraneous-dependencies': 2,
			'import-x/no-named-as-default': 0,
			'import-x/no-named-as-default-member': 0,
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
		...jsdocConfigs['flat/recommended'],
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
			ecmaVersion: 'latest',
			globals: {
				...globals.builtin,
				...globals.nodeBuiltin,
			},
		},
	},
	// Turns off every rule that `@d-zero/oxlint-config` already covers, generated straight from
	// its config object so the two configs can't drift out of sync. `import-x/*` overlaps are
	// handled manually above (see the comment there).
	...oxlintPlugin.buildFromOxlintConfig(oxlintConfig),
];
