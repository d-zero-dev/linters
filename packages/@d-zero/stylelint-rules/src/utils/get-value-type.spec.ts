import type { Rule, Declaration } from 'postcss';

import postcss from 'postcss';
import { describe, test, expect } from 'vitest';

import { getValueType } from './get-value-type.js';

function p(css: string) {
	const root = postcss.parse(css);
	const rule = root.first as Rule;
	const decl = rule.first as Declaration;
	const nodeWithType = getValueType(decl);
	return nodeWithType?.map((node) => node.valueType) ?? null;
}

describe('getValueType', () => {
	test('flex', () => {
		expect(p('a { flex: 1 1 calc(var(--foo) * 10vw) }')).toEqual([
			'number',
			'number',
			'length',
		]);
	});

	test('max-width', () => {
		expect(p('a { max-width: 10% }')).toEqual(['length-percentage']);
	});

	test('height vw', () => {
		expect(p('a { height: 100vw }')).toEqual(['length']);
	});

	test('SASS Variable', () => {
		expect(p('a { flex: 1 2 $basis }')).toEqual(['number', 'number', '$SASS_VARIABLE']);
	});

	test('SASS Variable Definition', () => {
		expect(p('a { $var: value }')).toEqual(null);
	});
});
