import base from './base.js';
import name from './name.js';
import pug from './pug.js';

/**
 * @type {import('@markuplint/ml-config').Config}
 */
export default {
	...base,
	...pug,
	...name,
	parser: {
		...base.parser,
		...pug.parser,
		...name.parser,
	},
	rules: {
		...base.rules,
		...pug.rules,
		...name.rules,
	},
	nodeRules: [
		//
		...(base.nodeRules ?? []),
		...(pug.nodeRules ?? []),
		...(name.nodeRules ?? []),
	],
	childNodeRules: [
		//
		...(base.childNodeRules ?? []),
		...(pug.childNodeRules ?? []),
		...(name.childNodeRules ?? []),
	],
};
