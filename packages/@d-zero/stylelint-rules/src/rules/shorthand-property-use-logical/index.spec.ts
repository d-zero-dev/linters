import stylelint from 'stylelint';
import { describe, test, expect } from 'vitest';

import rule from './index.js';

const { lint } = stylelint;

const config = (settings: boolean | { properties?: string[] } = true) => ({
	plugins: [rule],
	rules: {
		// @ts-ignore
		[rule.ruleName]: settings,
	},
});

describe('shorthand-property-use-logical', () => {
	describe('padding', () => {
		test('single value - should not warn', async () => {
			const {
				// @ts-ignore
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: '* { padding: 2rem }',
				config: config(),
			});

			expect(parseErrors).toHaveLength(0);
			expect(warnings).toHaveLength(0);
		});

		test('two values - should warn', async () => {
			const {
				// @ts-ignore
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: '* { padding: 2rem 1rem }',
				config: config(),
			});

			expect(parseErrors).toHaveLength(0);
			expect(warnings).toStrictEqual([
				{
					rule: '@d-zero/shorthand-property-use-logical',
					severity: 'error',
					line: 1,
					endLine: 1,
					column: 5,
					endColumn: 23,
					text: 'Unexpected shorthand property "padding" with multiple values. Consider using logical properties: padding-block, padding-inline (@d-zero/shorthand-property-use-logical)',
					url: undefined,
					fix: undefined,
				},
			]);
		});

		test('three values - should warn', async () => {
			const {
				// @ts-ignore
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: '* { padding: 2rem 0 0 }',
				config: config(),
			});

			expect(parseErrors).toHaveLength(0);
			expect(warnings).toHaveLength(1);
			expect(warnings[0].text).toContain('Unexpected shorthand property "padding"');
		});

		test('four values - should warn', async () => {
			const {
				// @ts-ignore
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: '* { padding: 1rem 2rem 3rem 4rem }',
				config: config(),
			});

			expect(parseErrors).toHaveLength(0);
			expect(warnings).toHaveLength(1);
			expect(warnings[0].text).toContain('Unexpected shorthand property "padding"');
		});
	});

	describe('margin', () => {
		test('single value - should not warn', async () => {
			const {
				// @ts-ignore
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: '* { margin: auto }',
				config: config(),
			});

			expect(parseErrors).toHaveLength(0);
			expect(warnings).toHaveLength(0);
		});

		test('two values - should warn', async () => {
			const {
				// @ts-ignore
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: '* { margin: 1rem 2rem }',
				config: config(),
			});

			expect(parseErrors).toHaveLength(0);
			expect(warnings).toHaveLength(1);
			expect(warnings[0].text).toContain('margin-block, margin-inline');
		});
	});

	describe('border-width', () => {
		test('single value - should not warn', async () => {
			const {
				// @ts-ignore
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: '* { border-width: 1px }',
				config: config(),
			});

			expect(parseErrors).toHaveLength(0);
			expect(warnings).toHaveLength(0);
		});

		test('multiple values - should warn', async () => {
			const {
				// @ts-ignore
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: '* { border-width: 1px 2px }',
				config: config(),
			});

			expect(parseErrors).toHaveLength(0);
			expect(warnings).toHaveLength(1);
			expect(warnings[0].text).toContain('border-block-width, border-inline-width');
		});
	});

	describe('limited properties configuration', () => {
		test('only check specified properties', async () => {
			const {
				// @ts-ignore
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: '* { padding: 1rem 2rem; margin: 1rem 2rem; }',
				config: config({ properties: ['padding'] }),
			});

			expect(parseErrors).toHaveLength(0);
			expect(warnings).toHaveLength(1);
			expect(warnings[0].text).toContain('padding');
		});
	});

	describe('unsupported properties', () => {
		test('should not check properties not in the list', async () => {
			const {
				// @ts-ignore
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: '* { background: url(a.png) no-repeat }',
				config: config(),
			});

			expect(parseErrors).toHaveLength(0);
			expect(warnings).toHaveLength(0);
		});
	});

	describe('complex values', () => {
		test('calc() function with multiple values', async () => {
			const {
				// @ts-ignore
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: '* { padding: calc(1rem + 2px) 1rem }',
				config: config(),
			});

			expect(parseErrors).toHaveLength(0);
			expect(warnings).toHaveLength(1);
		});

		test('var() function with multiple values', async () => {
			const {
				// @ts-ignore
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: '* { margin: var(--spacing) 2rem }',
				config: config(),
			});

			expect(parseErrors).toHaveLength(0);
			expect(warnings).toHaveLength(1);
		});
	});
});