import scopes from '@d-zero/cz-config/scopes';

export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'scope-enum': [2, 'always', scopes],
	},
};
