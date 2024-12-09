import { base } from './base.js';
import { commonjs } from './commonjs.js';
import { frontend } from './frontend.js';
import { ts } from './typescript.js';

/**
 * @type {import('eslint').ESLint.Plugin}
 */
export default {
	configs: {
		standard: [...ts],
		base: [...base],
		node: [...ts],
		nodeNoTS: [...base],
		frontend: [...ts, frontend],
		frontendNoTS: [...base, frontend],
		commonjs,
	},
};
