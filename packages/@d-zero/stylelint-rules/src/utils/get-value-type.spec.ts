import type { Rule, Declaration } from 'postcss';

import { parse } from 'postcss';
import { describe, test, expect } from 'vitest';

import { getValueType } from './get-value-type.js';

/**
 *
 * @param css
 */
function p(css: string) {
	const root = parse(css);
	const rule = root.first as Rule;
	const decl = rule.first as Declaration;
	const nodeWithType = getValueType(decl);
	return nodeWithType?.map((node) => node.valueType);
}

describe('getValueType', () => {
	test('flex', () => {
		expect(p('a { flex: 1 1 calc(var(--foo) * 10vw) }')).toEqual([
			'number',
			'number',
			'length-percentage',
		]);
	});

	test('max-width', () => {
		expect(p('a { max-width: 10% }')).toEqual(['length-percentage']);
	});

	test('height vw', () => {
		expect(p('a { height: 100vw }')).toEqual(['length-percentage']);
	});

	test('background', () => {
		expect(p('a { background: url(../../img/edit.png) no-repeat scroll 0 0 }')).toEqual([
			'bg-image',
			'repeat-style',
			'attachment',
			'length-percentage',
			'length-percentage',
		]);
	});

	test('SASS Variable', () => {
		expect(p('a { flex: 1 2 $basis }')).toEqual(['number', 'number', '$SASS_VARIABLE']);
	});

	test('SASS Variable Definition', () => {
		expect(p('a { $var: value }')).toEqual(undefined);
	});
});
