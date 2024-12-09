import globals from 'globals';

/**
 * @type {import('eslint').Linter.Config}
 */
export const commonjs = {
	rules: {
		'unicorn/prefer-module': 0,
		'@typescript-eslint/no-require-imports': 0,
	},
	languageOptions: {
		globals: {
			...globals.commonjs,
		},
	},
};
