import base from './base.js';
import nameConfig, { nameWith } from './name.js';
import pug from './pug.js';

const createConfig = (name = nameConfig) => {
	return {
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
		overrideMode: 'merge',
		overrides: {
			...pug.overrides,
		},
	};
};

/**
 * @type {import('@markuplint/ml-config').Config}
 */
export default createConfig();

/**
 *
 * @param {object} options
 * @param {string[]?} options.classNaming
 * @returns
 */
export const extendsConfig = (options) => {
	const name = options?.classNaming ? nameWith(options.classNaming) : nameConfig;
	return createConfig(name);
};
