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
				text: 'クラス名がファイル名と一致しないか、コンポーネント命名規則（test__）で始まっていません (@d-zero/component)',
				url: undefined,
				fix: undefined,
			},
		]);
	});
});

describe('Component Naming Convention for CSS', () => {
	test('exact match in CSS', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: 'button.css',
			code: '.button { color: currentColor; }',
			config: config({}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toHaveLength(0);
	});

	test('component element match in CSS', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: 'button.css',
			code: '.button__text { color: currentColor; }',
			config: config({}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toHaveLength(0);
	});

	test('multiple component elements in CSS (auto-allow)', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: 'button.css',
			code: '.button__text, .button__icon { color: currentColor; }',
			config: config({}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toHaveLength(0);
	});

	test('mixed component and component elements in CSS', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: 'button.css',
			code: '.button, .button__text, .button__icon { color: currentColor; }',
			config: config({}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toHaveLength(0);
	});

	test('invalid component naming convention in CSS', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: 'button.css',
			code: '.card__text { color: currentColor; }',
			config: config({}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toStrictEqual([
			{
				column: 1,
				endColumn: 37,
				endLine: 1,
				line: 1,
				rule: '@d-zero/component',
				severity: 'error',
				text: 'クラス名がファイル名と一致しないか、コンポーネント命名規則（button__）で始まっていません (@d-zero/component)',
				url: undefined,
				fix: undefined,
			},
		]);
	});

	test('CSS with wrong component name', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: 'button.css',
			code: '.card { color: currentColor; }',
			config: config({}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toStrictEqual([
			{
				column: 1,
				endColumn: 31,
				endLine: 1,
				line: 1,
				rule: '@d-zero/component',
				severity: 'error',
				text: 'クラス名がファイル名と一致しないか、コンポーネント命名規則（button__）で始まっていません (@d-zero/component)',
				url: undefined,
				fix: undefined,
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
	test('allowMultipleSelectors: false in SCSS', async () => {
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

	test('allowMultipleSelectors: true in SCSS', async () => {
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

	test('CSS files automatically allow multiple selectors', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: 'button.css',
			code: '.button, .button__text, .button__icon { color: currentColor; }',
			config: config({
				allowMultipleSelectors: false, // この設定は CSS では無視される
			}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toHaveLength(0);
	});

	test('CSS files allow multiple rules', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: 'button.css',
			code: `.button { color: currentColor; }
.button__text { font-size: 14px; }
.button__icon { width: 16px; }`,
			config: config({}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toHaveLength(0);
	});

	test('CSS files reject multiple components', async () => {
		const {
			// @ts-ignore
			results: [{ warnings, parseErrors }],
		} = await lint({
			codeFilename: 'c-component.css',
			code: `.c-component { --prop: value; }
.c-component__element { --prop: value; }
.c-component2 { --prop: value; }
.c-specific { --prop: value; }`,
			config: config({}),
		});

		expect(parseErrors).toHaveLength(0);
		expect(warnings).toHaveLength(2);
		expect(warnings[0].text).toBe(
			'クラス名がファイル名と一致しないか、コンポーネント命名規則（c-component__）で始まっていません (@d-zero/component)',
		);
		expect(warnings[1].text).toBe(
			'クラス名がファイル名と一致しないか、コンポーネント命名規則（c-component__）で始まっていません (@d-zero/component)',
		);
	});
});
