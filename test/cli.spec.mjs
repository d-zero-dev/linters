import path from 'node:path';

import { execa } from 'execa';
import { describe, test, expect } from 'vitest';

describe('markuplint', () => {
	test('CLI', async () => {
		const { stdout } = await execa(
			'yarn',
			[
				'markuplint',
				path.normalize('test/fixtures/markuplint/*'),
				'--format',
				'json',
				'--locale',
				'en',
			],
			{
				reject: false,
			},
		);
		const lines = stdout.split('\n');
		const result = lines.slice(1).join('\n');
		const violations = JSON.parse(result);
		const formatted = violations.map(
			(v) =>
				`${path.relative(process.cwd(), v.filePath)}:${v.line}:${v.col} ${v.message}`,
		);
		expect(formatted).toStrictEqual([
			'test/fixtures/markuplint/test.pug:14:6 The "c-component__invalid-element-nesting" class name is unmatched with the below patterns: "/^c-component2__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-(?!component2)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-component2[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/test.pug:9:4 The "div" element is not allowed in the "span" element in this context',
			'test/fixtures/markuplint/test.html:14:18 The "c-component__invalid-element-nesting" class name is unmatched with the below patterns: "/^c-component2__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-(?!component2)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-component2[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/test.html:9:9 The "div" element is not allowed in the "span" element in this context',
			'test/fixtures/markuplint/test.html:1:1 Require the "h1" element',
		]);
	});
});
