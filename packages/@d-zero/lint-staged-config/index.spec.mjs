import path from 'node:path';

import { describe, test, expect } from 'vitest';

import lintStagedConfigGenerator from './index.mjs';

describe('lintStagedConfigGenerator', () => {
	const defaultConfig = lintStagedConfigGenerator();
	const cwd = process.cwd().replaceAll(path.sep, '/');

	test('defaultMapping', () => {
		expect(
			defaultConfig([path.resolve(process.cwd(), 'README.md')]).map((shell) =>
				shell.replaceAll(cwd + '/', './').replaceAll(cwd, '.'),
			),
		).toStrictEqual([
			'prettier --write "./README.md"',
			'cspell --no-must-find-files --show-suggestions "./README.md"',
		]);
	});
});
