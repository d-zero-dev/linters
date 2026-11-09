import dz from '@d-zero/eslint-config';

/**
 * @type {import('eslint').ESLint.ConfigData[]}
 */
export default [
	...dz.configs.base,
	{
		files: ['*.mjs', '**/*.spec.{js,mjs}'],
		rules: {
			'import-x/no-extraneous-dependencies': 0,
		},
	},
	{
		files: [
			'.textlintrc.js',
			'**/cz-config/**',
			'**/pug-lint-config/**',
			'**/stylelint-config/**',
			'**/textlint-config/**',
		],
		...dz.configs.commonjs,
	},
	{
		ignores: ['**/lib/**/*', '**/dist/**', 'test/fixtures/**', '**/*.json'],
	},
];
