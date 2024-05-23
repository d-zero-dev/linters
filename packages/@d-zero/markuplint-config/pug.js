import path from 'node:path';

/**
 * @type {import('@markuplint/ml-config').Config}
 */
export default {
	parser: {
		'.pug$': '@markuplint/pug-parser',
	},
	overrideMode: 'merge',
	overrides: {
		[path.resolve(process.cwd(), '**', '*.pug')]: {
			rules: {
				'character-reference': false,
			},
		},
	},
};
