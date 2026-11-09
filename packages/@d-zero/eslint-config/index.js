import { base } from './base.js';
import { commonjs } from './commonjs.js';
import { frontend } from './frontend.js';

/**
 * @type {import('eslint').ESLint.Plugin}
 */
export default {
	configs: {
		base: [...base],
		frontend: [...base, frontend],
		commonjs,
	},
};
