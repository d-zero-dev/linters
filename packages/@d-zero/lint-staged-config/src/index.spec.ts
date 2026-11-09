import path from 'node:path';

import { describe, test, expect } from 'vitest';

import lintStagedConfigGenerator from './index.js';

/**
 *
 * @param {...string} paths
 */
function resolve(...paths: string[]): string {
	return path.resolve(...paths).replaceAll(path.sep, '/');
}

/**
 *
 * @param {...string} paths
 */
function toRelativePath(...paths: string[]): string[] {
	const cwd = process.cwd().replaceAll(path.sep, '/');
	return paths.map((p) => p.replaceAll(cwd, '.'));
}

describe('lintStagedConfigGenerator', () => {
	test('defaultMapping', () => {
		const config = lintStagedConfigGenerator();
		const commands = toRelativePath(...config([resolve('README.md')]));
		expect(commands).toStrictEqual([
			'oxfmt --write "./README.md"',
			'textlint "./README.md"',
			'cspell --no-must-find-files --show-suggestions "./README.md"',
		]);
	});

	test('ignore option', () => {
		const config = lintStagedConfigGenerator({
			ignore: [resolve('packages', '@d-zero', 'eslint-config', '*')],
		});
		const commands = toRelativePath(
			...config([
				resolve('packages', '@d-zero', 'eslint-config', 'CHANGELOG.md'),
				resolve('packages', '@d-zero', 'lint-staged-config', 'CHANGELOG.md'),
			]),
		);

		expect(commands).toStrictEqual([
			'oxfmt --write "./packages/@d-zero/lint-staged-config/CHANGELOG.md"',
			'textlint "./packages/@d-zero/lint-staged-config/CHANGELOG.md"',
			'cspell --no-must-find-files --show-suggestions "./packages/@d-zero/lint-staged-config/CHANGELOG.md"',
		]);
	});

	test('ts extension mapping uses oxlint and oxfmt', () => {
		const config = lintStagedConfigGenerator();
		const commands = toRelativePath(...config([resolve('src', 'index.ts')]));
		expect(commands).toStrictEqual([
			'oxlint --fix "./src/index.ts"',
			'oxfmt --write "./src/index.ts"',
			'cspell --no-must-find-files --show-suggestions "./src/index.ts"',
		]);
	});

	test('vue extension mapping uses oxlint, markuplint and oxfmt', () => {
		const config = lintStagedConfigGenerator();
		const commands = toRelativePath(...config([resolve('src', 'App.vue')]));
		expect(commands).toStrictEqual([
			'oxlint --fix "./src/App.vue"',
			'markuplint "./src/App.vue"',
			'oxfmt --write "./src/App.vue"',
			'cspell --no-must-find-files --show-suggestions "./src/App.vue"',
		]);
	});

	test('css extension mapping uses stylelint and oxfmt', () => {
		const config = lintStagedConfigGenerator();
		const commands = toRelativePath(...config([resolve('src', 'style.css')]));
		expect(commands).toStrictEqual([
			'stylelint --fix "./src/style.css"',
			'oxfmt --write "./src/style.css"',
			'cspell --no-must-find-files --show-suggestions "./src/style.css"',
		]);
	});

	test('html extension mapping uses markuplint and oxfmt', () => {
		const config = lintStagedConfigGenerator();
		const commands = toRelativePath(...config([resolve('src', 'index.html')]));
		expect(commands).toStrictEqual([
			'markuplint "./src/index.html"',
			'oxfmt --write "./src/index.html"',
			'cspell --no-must-find-files --show-suggestions "./src/index.html"',
		]);
	});

	test('json extension mapping uses oxfmt (no oxlint)', () => {
		const config = lintStagedConfigGenerator();
		const commands = toRelativePath(...config([resolve('package.json')]));
		expect(commands).toStrictEqual([
			'oxfmt --write "./package.json"',
			'cspell --no-must-find-files --show-suggestions "./package.json"',
		]);
	});

	test('yaml extension mapping uses oxfmt', () => {
		const config = lintStagedConfigGenerator();
		const commands = toRelativePath(...config([resolve('config.yaml')]));
		expect(commands).toStrictEqual([
			'oxfmt --write "./config.yaml"',
			'cspell --no-must-find-files --show-suggestions "./config.yaml"',
		]);
	});

	test('ignore option (IgnoreMap)', () => {
		const config = lintStagedConfigGenerator({
			ignore: [
				resolve('packages', '@d-zero', 'eslint-config', '*'),
				{
					textlint: 'CHANGELOG.md',
				},
			],
		});
		const commands = toRelativePath(
			...config([
				resolve('packages', '@d-zero', 'eslint-config', 'CHANGELOG.md'),
				resolve('packages', '@d-zero', 'lint-staged-config', 'CHANGELOG.md'),
			]),
		);

		expect(commands).toStrictEqual([
			'oxfmt --write "./packages/@d-zero/lint-staged-config/CHANGELOG.md"',
			'cspell --no-must-find-files --show-suggestions "./packages/@d-zero/lint-staged-config/CHANGELOG.md"',
		]);
	});
});
