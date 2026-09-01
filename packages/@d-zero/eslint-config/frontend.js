import dzeroPlugin from '@d-zero/eslint-plugin';
import globals from 'globals';

/**
 * @type {import('eslint').Linter.Config}
 */
export const frontend = {
	plugins: {
		'@d-zero': dzeroPlugin,
	},
	rules: {
		'@d-zero/no-click-event': 'warn',
	},
	languageOptions: {
		globals: {
			...globals.browser,
		},
	},
};
