import config from '@d-zero/oxlint-config';

export default {
	...config,
	jsPlugins: ['@d-zero/oxlint-plugin'],
	rules: {
		...config.rules,
		'@d-zero/no-click-event': 'warn',
	},
	overrides: [
		{
			files: [
				'.textlintrc.js',
				'**/cz-config/**',
				'**/pug-lint-config/**',
				'**/stylelint-config/**',
				'**/textlint-config/**',
			],
			rules: {
				'typescript/no-require-imports': 'off',
				'typescript/no-var-requires': 'off',
				'unicorn/prefer-module': 'off',
			},
		},
		{
			// `null` is Stylelint's own API for explicitly disabling a rule; it isn't a stray
			// literal to clean up.
			files: ['**/stylelint-config/**'],
			rules: {
				'unicorn/no-null': 'off',
			},
		},
	],
};
