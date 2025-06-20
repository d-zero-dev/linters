import stylelint from 'stylelint';
import { describe, test, expect } from 'vitest';

import plugin from './index.js';

const ruleName = '@d-zero/prefer-individual-transform-properties';

/**
 * Helper function to run stylelint with the plugin
 * @param code
 * @param options
 */
async function lint(code: string, options?: unknown) {
	const result = await stylelint.lint({
		code,
		config: {
			plugins: [plugin],
			rules: {
				[ruleName]: options || true,
			},
		},
	});

	return result.results[0]?.warnings || [];
}

describe('prefer-individual-transform-properties', () => {
	test('should flag simple translate function', async () => {
		const warnings = await lint(`
			.element {
				transform: translate(10px, 20px);
			}
		`);

		expect(warnings).toHaveLength(1);
		expect(warnings[0]?.text).toContain('translate: 10px, 20px');
	});

	test('should flag simple rotate function', async () => {
		const warnings = await lint(`
			.element {
				transform: rotate(45deg);
			}
		`);

		expect(warnings).toHaveLength(1);
		expect(warnings[0]?.text).toContain('rotate: 45deg');
	});

	test('should flag simple scale function', async () => {
		const warnings = await lint(`
			.element {
				transform: scale(1.5);
			}
		`);

		expect(warnings).toHaveLength(1);
		expect(warnings[0]?.text).toContain('scale: 1.5');
	});

	test('should flag translateX function', async () => {
		const warnings = await lint(`
			.element {
				transform: translateX(10px);
			}
		`);

		expect(warnings).toHaveLength(1);
		expect(warnings[0]?.text).toContain('translate: 10px');
	});

	test('should flag rotateY function', async () => {
		const warnings = await lint(`
			.element {
				transform: rotateY(90deg);
			}
		`);

		expect(warnings).toHaveLength(1);
		expect(warnings[0]?.text).toContain('rotate: 90deg');
	});

	test('should flag scaleX function', async () => {
		const warnings = await lint(`
			.element {
				transform: scaleX(2);
			}
		`);

		expect(warnings).toHaveLength(1);
		expect(warnings[0]?.text).toContain('scale: 2');
	});

	test('should not flag complex transforms with multiple different functions', async () => {
		const warnings = await lint(`
			.element {
				transform: translate(10px, 20px) rotate(45deg) scale(1.5);
			}
		`);

		// This contains multiple transform types, so it cannot be easily replaced
		expect(warnings).toHaveLength(0);
	});

	test('should not flag transforms with matrix functions', async () => {
		const warnings = await lint(`
			.element {
				transform: matrix(1, 0, 0, 1, 10, 20);
			}
		`);

		expect(warnings).toHaveLength(0);
	});

	test('should not flag transforms with skew functions', async () => {
		const warnings = await lint(`
			.element {
				transform: skew(20deg, 10deg);
			}
		`);

		expect(warnings).toHaveLength(0);
	});

	test('should not flag transforms mixing replaceable and non-replaceable functions', async () => {
		const warnings = await lint(`
			.element {
				transform: translate(10px, 20px) skew(20deg);
			}
		`);

		expect(warnings).toHaveLength(0);
	});

	test('should not flag non-transform properties', async () => {
		const warnings = await lint(`
			.element {
				transition: transform 0.3s ease;
				will-change: transform;
			}
		`);

		expect(warnings).toHaveLength(0);
	});

	test('should handle CSS variables in transform values', async () => {
		const warnings = await lint(`
			.element {
				transform: translate(var(--x), var(--y));
			}
		`);

		expect(warnings).toHaveLength(1);
		expect(warnings[0]?.text).toContain('translate: var(--x), var(--y)');
	});

	test('should handle calc() in transform values', async () => {
		const warnings = await lint(`
			.element {
				transform: translate(calc(100% - 20px), 0);
			}
		`);

		expect(warnings).toHaveLength(1);
		expect(warnings[0]?.text).toContain('translate: calc(100% - 20px), 0');
	});
});