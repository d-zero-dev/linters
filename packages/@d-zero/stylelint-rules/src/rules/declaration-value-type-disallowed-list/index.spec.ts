import stylelint from 'stylelint';
import { describe, test, expect } from 'vitest';

import rule from './index.js';

const { lint } = stylelint;

const config = (settings: Record<string, unknown> | boolean = true) => ({
	plugins: [rule],
	rules: {
		// @ts-ignore
		[rule.ruleName]: settings,
	},
});

describe('length-pattern', () => {
	test('length in flex', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			code: '* { flex: 1 1 10px }',
			config: config({
				length: ['/[0-9]{2,}px/'],
			}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toStrictEqual([
			{
				rule: '@d-zero/declaration-value-type-disallowed-list',
				severity: 'error',
				line: 1,
				endLine: 1,
				column: 15,
				endColumn: 19,
				text: 'Unexpected value "10px" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			},
		]);
	});

	test('ignoreProperties options', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			code: '* { flex: 1 1 10px }',
			config: config({
				length: {
					ignoreProperties: ['flex'],
					patterns: ['/[0-9]{2,}px/'],
				},
			}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toHaveLength(0);
	});
});
