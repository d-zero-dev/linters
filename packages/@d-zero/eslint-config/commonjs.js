import globals from 'globals';

/**
 * @type {import('eslint').Linter.Config}
 */
export const commonjs = {
	languageOptions: {
		globals: {
			...globals.commonjs,
		},
	},
};
