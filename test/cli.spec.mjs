import path from 'node:path';

import { execa } from 'execa';
import { describe, test, expect } from 'vitest';

/**
 * @param {string} filePath
 * @returns {string}
 */
function n(filePath) {
	return path.relative(process.cwd(), filePath).replaceAll(path.sep, '/');
}

describe('ESLint', () => {
	test('sort-class-members', async () => {
		const { stdout } = await execa(
			'yarn',
			[
				'eslint',
				path.normalize('test/fixtures/eslint/sort-class-members.ts'),
				'-f',
				'compact',
			],
			{
				reject: false,
			},
		);
		const lines = stdout.split('\n');
		const result = lines
			.filter((line) => line.includes('sort-class-members/sort-class-members'))
			.map((line) => line.replace(process.cwd() + path.sep, ''));

		expect(result).toStrictEqual([
			'test/fixtures/eslint/sort-class-members.ts: line 3, col 2, Warning - Expected property member to come before constructor. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 8, col 2, Warning - Expected getter getter to come before constructor. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 9, col 2, Warning - Expected property member to come before constructor. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 9, col 2, Warning - Expected property member to come before getter getter. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 12, col 2, Warning - Expected method method to come before static property staticMember. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 17, col 2, Warning - Expected property c1 to come before property #a. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 18, col 2, Warning - Expected property c2 to come before property #a. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 18, col 2, Warning - Expected property c2 to come before property c1. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 19, col 2, Warning - Expected property b2 to come before property #a. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 20, col 2, Warning - Expected property b1 to come before property #a. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 20, col 2, Warning - Expected property b1 to come before property b2. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 30, col 2, Warning - Expected getter b to come immediately before setter b. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 47, col 2, Warning - Expected method #privateMethod to come before method _method. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 48, col 2, Warning - Expected method method2 to come before method _method. (sort-class-members/sort-class-members)',
			'test/fixtures/eslint/sort-class-members.ts: line 48, col 2, Warning - Expected method method2 to come before method #privateMethod. (sort-class-members/sort-class-members)',
		]);
	});
});

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
			(v) => `${n(v.filePath)}:${v.line}:${v.col} ${v.message}`,
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

describe('stylelint', () => {
	test('Class Name', async () => {
		const { stdout, stderr } = await execa(
			'yarn',
			[
				'run',
				'stylelint',
				path.normalize('test/fixtures/stylelint/class-name.scss'),
				'-f',
				'json',
			],
			{
				reject: false,
			},
		);

		const json = stderr.split('error Command failed')[0] ?? stdout;
		const violations = JSON.parse(json);
		const formatted = violations
			.flatMap((v) => v.warnings.map((w) => ({ ...w, source: v.source })))
			.toSorted((a, b) => a.line - b.line)
			.toSorted((a, b) => a.source - b.source)
			.map(
				(v) => `${n(v.source)}:${v.line}:${v.column} ${v.text.replaceAll(/\s+/g, ' ')}`,
			);
		expect(formatted).toStrictEqual([
			'test/fixtures/stylelint/class-name.scss:1:1 クラス名は「c-」から始めてください: .component',
			'test/fixtures/stylelint/class-name.scss:10:2 「__」はコンポーネント名とエレメント名の区切りを表します。エレメント名の文字区切りは「-」を使います: .c-component__invalid__element-name',
			'test/fixtures/stylelint/class-name.scss:14:2 クラス名に命名規則にない文字が含まれています: .c-component__foo😁bar',
			'test/fixtures/stylelint/class-name.scss:18:2 コンポーネントのスタイル定義の中で別のコンポーネントを定義してはいけません: .c-component2',
			'test/fixtures/stylelint/class-name.scss:23:1 スタイル定義でIDセレクタは使わないでください',
		]);
	});

	test('Value and Unit', async () => {
		const { stdout, stderr } = await execa(
			'yarn',
			[
				'run',
				'stylelint',
				path.normalize('test/fixtures/stylelint/unit.scss'),
				'-c',
				path.normalize('test/fixtures/stylelint/.stylelintrc.unit.json'),
				'-f',
				'json',
			],
			{
				reject: false,
			},
		);

		const json = stderr.split('error Command failed')[0] ?? stdout;

		let violations;
		try {
			violations = JSON.parse(json);
		} catch {
			throw new Error(stderr);
		}

		const formatted = violations
			.flatMap((v) => v.warnings.map((w) => ({ ...w, source: v.source })))
			.toSorted((a, b) => a.line - b.line)
			.toSorted((a, b) => a.source - b.source)
			.map(
				(v) => `${n(v.source)}:${v.line}:${v.column} ${v.text.replaceAll(/\s+/g, ' ')}`,
			);
		expect(formatted).toStrictEqual([
			'test/fixtures/stylelint/unit.scss:12:13 Unexpected value "3em" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:13:13 Unexpected value "1.2em" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:14:13 Unexpected value "0.5em" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:15:13 Unexpected value "4vw" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:32:13 Unexpected value "16px" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:34:13 Unexpected value "16ex" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:34:15 Unexpected unit "ex" (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:35:13 Unexpected value "16pt" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:35:15 Unexpected unit "pt" (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:36:13 Unexpected value "16cm" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:36:15 Unexpected unit "cm" (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:45:15 Expected "400" to be "normal" (font-weight-notation)',
			'test/fixtures/stylelint/unit.scss:57:10 Unexpected unit (length-zero-no-unit)',
			'test/fixtures/stylelint/unit.scss:67:9 Unexpected value "5%" for type "percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:68:9 Unexpected value "50%" for type "percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:69:14 Unexpected value "33.3%" for type "percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:74:13 Unexpected value "calc(160 / 320 * 54.2vw)" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:75:14 Unexpected value "calc(2vw / 2)" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:76:14 Unexpected value "calc(50vh / 2)" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:77:14 Unexpected value "calc(105% / 3)" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:78:14 Unexpected value "calc(120% / 3)" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:79:14 Unexpected value "calc(200% / 3)" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:80:14 Unexpected value "calc(1000% / 3)" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:81:12 Unexpected value "calc(105% / 3)" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:83:11 Unexpected unit "ex" (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:84:11 Unexpected unit "pt" (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:85:11 Unexpected unit "cm" (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:95:8 Unexpected value "0 2 calc(100% / 3)" for property "flex" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:98:13 Unexpected value "2" for property "flex-grow" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:101:15 Unexpected value "2" for property "flex-shrink" (declaration-property-value-allowed-list)',
		]);
	});
});
