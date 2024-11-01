const ts = require('./typescript');

/**
 * @type {import('eslint/lib/shared/types').ConfigData}
 */
module.exports = {
	...ts,
	rules: {
		...ts.rules,
		'unicorn/prefer-top-level-await': 0,
	},
};
