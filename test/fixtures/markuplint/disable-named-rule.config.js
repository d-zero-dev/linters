import base from '@d-zero/markuplint-config/base';

export default {
	...base,
	rules: {
		...base.rules,
		[process.env.MARKUPLINT_DISABLE_RULE]: false,
	},
};
