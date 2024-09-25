import path from 'node:path';

import { describe, test, expect } from 'vitest';

import lintStagedConfigGenerator from './index.js';

function resolve(...paths: string[]): string {
	return path.resolve(...paths).replaceAll(path.sep, '/');
}

function toRelativePath(...paths: string[]): string[] {
	const cwd = process.cwd().replaceAll(path.sep, '/');
	return paths.map((p) => p.replaceAll(cwd, '.'));
}

describe('lintStagedConfigGenerator', () => {
	test('defaultMapping', () => {
		const config = lintStagedConfigGenerator();
		const commands = toRelativePath(...config([resolve('README.md')]));
		expect(commands).toStrictEqual([
			'prettier --write "./README.md"',
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
			'prettier --write "./packages/@d-zero/lint-staged-config/CHANGELOG.md"',
			'textlint "./packages/@d-zero/lint-staged-config/CHANGELOG.md"',
			'cspell --no-must-find-files --show-suggestions "./packages/@d-zero/lint-staged-config/CHANGELOG.md"',
		]);
	});

	test.only('ignore option (IgnoreMap)', () => {
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
			'prettier --write "./packages/@d-zero/lint-staged-config/CHANGELOG.md"',
			'cspell --no-must-find-files --show-suggestions "./packages/@d-zero/lint-staged-config/CHANGELOG.md"',
		]);
	});
});
