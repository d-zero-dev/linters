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
	],
};
