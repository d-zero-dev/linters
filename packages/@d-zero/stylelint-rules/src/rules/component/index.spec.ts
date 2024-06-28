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

describe('Exact Match', () => {
	test('matched', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: 'test.css',
			code: '.test { color: currentColor; }',
			config: config({}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toHaveLength(0);
	});

	test('unmatched', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: 'test.css',
			code: '.text, *, div.test { color: currentColor; .test { color: inherit; } }',
			config: config({}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toStrictEqual([
			{
				column: 1,
				endColumn: 70,
				endLine: 1,
				line: 1,
				rule: '@d-zero/component',
				severity: 'error',
				text: 'クラス名がファイル名と一致しません',
			},
			{
				column: 1,
				endColumn: 70,
				endLine: 1,
				line: 1,
				rule: '@d-zero/component',
				severity: 'error',
				text: 'セレクタの定義は1つだけです',
			},
		]);
	});
});

describe('Partial Name', () => {
	test('match', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: '_c-component.scss',
			code: '.c-component { color: currentColor; }',
			config: config({}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toHaveLength(0);
	});
});

describe('Options', () => {
	test('allowMultipleSelectors: false', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: '_c-component.scss',
			code: '.c-component, .x-specific-class-name { color: currentColor; }',
			config: config({}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toHaveLength(1);
	});

	test('allowMultipleSelectors: true', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: '_c-component.scss',
			code: '.c-component, .x-specific-class-name { color: currentColor; }',
			config: config({
				allowMultipleSelectors: true,
			}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toHaveLength(0);
	});
});
