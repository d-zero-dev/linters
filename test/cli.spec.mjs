import path from 'node:path';

import { execa } from 'execa';
import { vi, describe, test, expect } from 'vitest';

vi.setConfig({
	testTimeout: 15_000,
});

/**
 * @param {string} filePath
 * @returns {string}
 */
function n(filePath) {
	return path.relative(process.cwd(), filePath).replaceAll(path.sep, '/');
}

describe('ESLint', () => {
	const eslint = async (filepath, rule) => {
		const dir = path.dirname(filepath);
		const config = path.join(dir, 'eslint.config.js');
		const { stdout, stderr } = await execa(
			'npx',
			['eslint', filepath, '--config', config],
			{
				reject: false,
			},
		);

		if (stderr) {
			throw new Error(stderr);
		}

		const lines = stdout.split('\n');
		const result = lines
			.filter((line) => line.endsWith(rule))
			.map((line) => line.replaceAll(/\s+/g, ' ').trim());
		return result;
	};

	test('sort-class-members', async () => {
		const result = await eslint(
			'test/fixtures/eslint/sort-class-members.ts',
			'sort-class-members/sort-class-members',
		);
		expect(result).toStrictEqual([
			'3:2 warning Expected property member to come before constructor sort-class-members/sort-class-members',
			'8:2 warning Expected getter getter to come before constructor sort-class-members/sort-class-members',
			'11:2 warning Expected property member to come before constructor sort-class-members/sort-class-members',
			'11:2 warning Expected property member to come before getter getter sort-class-members/sort-class-members',
			'14:2 warning Expected method method to come before static property staticMember sort-class-members/sort-class-members',
			'19:2 warning Expected property c1 to come before property #a sort-class-members/sort-class-members',
			'20:2 warning Expected property c2 to come before property #a sort-class-members/sort-class-members',
			'20:2 warning Expected property c2 to come before property c1 sort-class-members/sort-class-members',
			'21:2 warning Expected property b2 to come before property #a sort-class-members/sort-class-members',
			'22:2 warning Expected property b1 to come before property #a sort-class-members/sort-class-members',
			'22:2 warning Expected property b1 to come before property b2 sort-class-members/sort-class-members',
			'32:2 warning Expected getter b to come immediately before setter b sort-class-members/sort-class-members',
			'49:2 warning Expected method #privateMethod to come before method _method sort-class-members/sort-class-members',
			'50:2 warning Expected method method2 to come before method _method sort-class-members/sort-class-members',
			'50:2 warning Expected method method2 to come before method #privateMethod sort-class-members/sort-class-members',
		]);
	});

	test('prefer-top-level-await', async () => {
		const frontend = await eslint(
			'test/fixtures/eslint/frontend/prefer-top-level-await.ts',
			'unicorn/prefer-top-level-await',
		);
		expect(frontend).toStrictEqual([]);

		const node = await eslint(
			'test/fixtures/eslint/node/prefer-top-level-await.ts',
			'unicorn/prefer-top-level-await',
		);
		expect(node).toStrictEqual([
			'5:6 error Prefer top-level await over an async function `asyncFn` call unicorn/prefer-top-level-await',
		]);
	});

	test('Disallow DOMContentLoaded', async () => {
		const frontend = await eslint(
			'test/fixtures/eslint/frontend/dom-content-loaded.ts',
			'no-restricted-syntax',
		);
		expect(frontend).toStrictEqual([
			"1:1 error Avoid using 'DOMContentLoaded'. Use 'defer' or 'type=module' attribute instead no-restricted-syntax",
		]);
	});

	test('no-click-event', async () => {
		const result = await eslint(
			'test/fixtures/eslint/no-click-event.ts',
			'@d-zero/no-click-event',
		);
		expect(result).toStrictEqual([
			'2:1 warning Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API @d-zero/no-click-event',
			'7:2 warning Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API @d-zero/no-click-event',
			'12:1 warning Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API @d-zero/no-click-event',
			'15:1 warning Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API @d-zero/no-click-event',
		]);
	});
});

describe('markuplint', () => {
	const markuplint = async (file, config) => {
		const { stdout } = await execa(
			'npx',
			[
				'markuplint',
				file,
				'--format',
				'json',
				'--locale',
				'en',
				config ? ['-c', config] : [],
			].flat(),
			{
				reject: false,
			},
		);

		try {
			const violations = JSON.parse(stdout);
			const formatted = violations.map(
				(v) => `${n(v.filePath)}:${v.line}:${v.col} ${v.message}`,
			);
			return formatted;
		} catch (error) {
			if (error instanceof SyntaxError) {
				throw new TypeError(`Output is not JSON: ${stdout}`, { ...error });
			}
			throw error;
		}
	};

	test('CLI', async () => {
		const violations = await markuplint('test/fixtures/markuplint/test.*');
		expect(violations).toStrictEqual([
			'test/fixtures/markuplint/test.pug:14:6 The "c-component__invalid-element-nesting" class name is unmatched with the below patterns: "/^c-component2__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-(?!component2)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-component2[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/test.pug:9:4 The "div" element is not allowed in the "span" element in this context',
			'test/fixtures/markuplint/test.html:17:66 Illegal characters must escape in character reference',
			'test/fixtures/markuplint/test.html:14:18 The "c-component__invalid-element-nesting" class name is unmatched with the below patterns: "/^c-component2__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-(?!component2)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-component2[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/test.html:26:3 The "br" element is disallowed',
			'test/fixtures/markuplint/test.html:25:12 The "href" attribute is matched with the below disallowed patterns: /^javascript:/i',
			'test/fixtures/markuplint/test.html:9:9 The "div" element is not allowed in the "span" element in this context',
			'test/fixtures/markuplint/test.html:23:3 Require accessible name',
			'test/fixtures/markuplint/test.html:25:3 Require accessible name',
			'test/fixtures/markuplint/test.html:23:3 The "img" element expects the "alt" attribute',
			'test/fixtures/markuplint/test.html:24:3 The "a" element expects the "href" attribute',
			'test/fixtures/markuplint/test.html:1:1 Require the "h1" element',
		]);
	});

	test('Extended Naming', async () => {
		const normalConfig = await markuplint('test/fixtures/markuplint/extended-naming.*');
		expect(normalConfig).toStrictEqual([
			'test/fixtures/markuplint/extended-naming.pug:2:2 The "splide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/extended-naming.pug:4:4 The "splide__track" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/extended-naming.pug:5:5 The "splide__list" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/extended-naming.pug:6:6 The "splide__slide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/extended-naming.pug:8:6 The "splide__slide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/extended-naming.pug:10:6 The "splide__slide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/extended-naming.pug:12:4 The "splide__arrows" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/extended-naming.pug:15:29 The "splide__pagination" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
		]);

		const addedClassName = await markuplint(
			'test/fixtures/markuplint/extended-naming.*',
			'test/fixtures/markuplint/extended-naming.config.js',
		);
		expect(addedClassName).toStrictEqual([]);

		const addedClassName2 = await markuplint(
			'test/fixtures/markuplint/extended-naming.*',
			'test/fixtures/markuplint/extended.config.js',
		);
		expect(addedClassName2).toStrictEqual([]);
	});

	test('Image Naming Convention', async () => {
		const invalidNaming = await markuplint(
			'test/fixtures/markuplint/image-naming-test.html',
			'packages/@d-zero/markuplint-config/base.js',
		);
		expect(invalidNaming).toStrictEqual([
			'test/fixtures/markuplint/image-naming-test.html:21:15 The "src" attribute is matched with the below disallowed patterns: /[A-Z\\s_]/',
			'test/fixtures/markuplint/image-naming-test.html:22:15 The "src" attribute is matched with the below disallowed patterns: /[A-Z\\s_]/',
			'test/fixtures/markuplint/image-naming-test.html:23:15 The "src" attribute is matched with the below disallowed patterns: /[A-Z\\s_]/',
			'test/fixtures/markuplint/image-naming-test.html:24:15 The "src" attribute is matched with the below disallowed patterns: /[A-Z\\s_]/',
		]);

		const validNaming = await markuplint(
			'test/fixtures/markuplint/valid-image-naming.html',
			'packages/@d-zero/markuplint-config/base.js',
		);
		expect(validNaming).toStrictEqual([]);
	});

	test('Button Command Attribute', async () => {
		const violations = await markuplint(
			'test/fixtures/markuplint/button-command.html',
			'packages/@d-zero/markuplint-config/base.js',
		);
		expect(violations).toStrictEqual([
			'test/fixtures/markuplint/button-command.html:27:17 The "btn" class name is unmatched with the below patterns: "/^c-(?<ComponentName>[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/"',
			'test/fixtures/markuplint/button-command.html:45:58 The "btn" class name is unmatched with the below patterns: "/^c-(?<ComponentName>[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/"',
			'test/fixtures/markuplint/button-command.html:102:2 Detected perceptible nodes between the trigger and corresponding target',
			'test/fixtures/markuplint/button-command.html:103:2 Detected perceptible nodes between the trigger and corresponding target',
			'test/fixtures/markuplint/button-command.html:104:2 Detected perceptible nodes between the trigger and corresponding target',
			'test/fixtures/markuplint/button-command.html:111:6 Detected perceptible nodes between the trigger and corresponding target',
			'test/fixtures/markuplint/button-command.html:110:2 Require accessible name',
			'test/fixtures/markuplint/button-command.html:129:3 Require accessible name',
			'test/fixtures/markuplint/button-command.html:18:2 The "button" element expects the "command" attribute',
			'test/fixtures/markuplint/button-command.html:101:2 The "button" element expects the "commandfor" attribute',
			'test/fixtures/markuplint/button-command.html:102:2 The "button" element expects the "command" attribute',
			'test/fixtures/markuplint/button-command.html:103:2 The "button" element expects the "command" attribute',
			'test/fixtures/markuplint/button-command.html:104:2 The "button" element expects the "command" attribute',
			'test/fixtures/markuplint/button-command.html:55:21 The "aria-selected" ARIA state is not global state',
			'test/fixtures/markuplint/button-command.html:63:16 The "button" role is the implicit role of the "button" element',
		]);
	});
});

describe('stylelint', () => {
	/**
	 *
	 * @param filePath
	 * @param configFilePath
	 */
	async function stylelint(filePath, configFilePath) {
		const { stdout, stderr } = await execa(
			'npx',
			[
				'stylelint',
				filePath,
				configFilePath ? ['-c', configFilePath] : [],
				'-f',
				'json',
			].flat(),
			{
				reject: false,
				env: {
					// For `DeprecationWarning: fs.Stats constructor is deprecated.` in `stylelint`
					NODE_NO_WARNINGS: '1',
				},
			},
		);

		const json = stderr.split('error Command failed')[0] ?? stdout;
		let violations;
		try {
			violations = JSON.parse(json);
		} catch (error) {
			if (error instanceof SyntaxError) {
				throw new TypeError(`Output is not JSON: ${json}`, { ...error });
			}
			throw error;
		}

		for (const violation of violations) {
			for (const invalidOptionWarning of violation.invalidOptionWarnings) {
				throw new Error(invalidOptionWarning.text);
			}
		}

		return violations
			.flatMap((v) => v.warnings.map((w) => ({ ...w, source: v.source })))
			.toSorted((a, b) => a.line - b.line)
			.toSorted((a, b) => a.source - b.source)
			.map(
				(v) => `${n(v.source)}:${v.line}:${v.column} ${v.text.replaceAll(/\s+/g, ' ')}`,
			);
	}

	test('Class Name', async () => {
		const violations = await stylelint(
			path.normalize('test/fixtures/stylelint/class-name.scss'),
		);

		expect(violations).toStrictEqual([
			'test/fixtures/stylelint/class-name.scss:1:1 クラス名は「c-」から始めてください: .component (selector-class-pattern)',
			'test/fixtures/stylelint/class-name.scss:6:2 Stylelint v17以降「&」を使ったセレクタの文字列結合に対応しなくなったため、「&」の使用を禁止します: &__element (selector-nested-pattern)',
			'test/fixtures/stylelint/class-name.scss:10:2 Stylelint v17以降「&」を使ったセレクタの文字列結合に対応しなくなったため、「&」の使用を禁止します: &__invalid__element-name (selector-nested-pattern)',
			'test/fixtures/stylelint/class-name.scss:14:2 Stylelint v17以降「&」を使ったセレクタの文字列結合に対応しなくなったため、「&」の使用を禁止します: &__foo😁bar (selector-nested-pattern)',
			'test/fixtures/stylelint/class-name.scss:18:2 コンポーネントのスタイル定義の中で別のコンポーネントを定義してはいけません: .c-component2 (selector-nested-pattern)',
			'test/fixtures/stylelint/class-name.scss:23:1 スタイル定義でIDセレクタは使わないでください (selector-max-id)',
			'test/fixtures/stylelint/class-name.scss:59:2 Stylelint v17以降「&」を使ったセレクタの文字列結合に対応しなくなったため、「&」の使用を禁止します: &__element (selector-nested-pattern)',
			'test/fixtures/stylelint/class-name.scss:64:2 Stylelint v17以降「&」を使ったセレクタの文字列結合に対応しなくなったため、「&」の使用を禁止します: &__foo (selector-nested-pattern)',
		]);
	});

	test('Value', async () => {
		const violations = await stylelint(
			path.normalize('test/fixtures/stylelint/values.scss'),
		);

		expect(violations).toStrictEqual([
			'test/fixtures/stylelint/values.scss:8:13 Unexpected value "$size" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/values.scss:9:13 Unexpected value "$base-line-height" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/values.scss:15:15 Unexpected value "10.5%" for type "percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:16:15 Unexpected value "101%" for type "percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:17:15 Unexpected value "199%" for type "percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:18:15 Unexpected value "200%" for type "percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:19:15 Unexpected value "999%" for type "percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:20:15 Unexpected value "1000%" for type "percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:21:34 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/values.scss:22:31 Unexpected value "1vw" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:22:32 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
		]);
	});

	test('Value and Unit', async () => {
		const violations = await stylelint(
			path.normalize('test/fixtures/stylelint/unit.scss'),
			path.normalize('test/fixtures/stylelint/.stylelintrc.unit.json'),
		);

		expect(violations).toStrictEqual([
			'test/fixtures/stylelint/unit.scss:12:13 Unexpected value "3em" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:13:13 Unexpected value "1.2em" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:14:13 Unexpected value "0.5em" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:15:13 Unexpected value "4vw" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:15:14 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:20:17 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:23:26 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:26:40 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:32:13 Unexpected value "16px" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:34:13 Unexpected value "16ex" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:34:15 `ex`は使用しないでください。代わりに`em, rem`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:35:13 Unexpected value "16pt" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:35:15 `pt`は使用しないでください。代わりに`px, rem`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:36:13 Unexpected value "16cm" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:36:15 `cm`は使用しないでください。代わりに`px, rem`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:45:15 Expected "400" to be "normal" (font-weight-notation)',
			'test/fixtures/stylelint/unit.scss:57:16 Unexpected unit (length-zero-no-unit)',
			'test/fixtures/stylelint/unit.scss:63:21 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:64:21 `vh`は使用しないでください。代わりに`svh, dvh, lvh`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:67:15 Unexpected value "5%" for type "percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:68:15 Unexpected value "50%" for type "percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:69:14 Unexpected value "33.3%" for type "percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:72:34 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:74:36 Unexpected value "54.2vw" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:74:40 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:75:23 Unexpected value "2vw" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:75:24 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:76:23 Unexpected value "50vh" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:76:25 `vh`は使用しないでください。代わりに`svh, dvh, lvh`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:77:19 Unexpected value "105%" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:78:19 Unexpected value "120%" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:79:19 Unexpected value "200%" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:80:19 Unexpected value "1000%" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:81:17 Unexpected value "105%" for type "length" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:83:17 `ex`は使用しないでください。代わりに`em, rem`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:84:17 `pt`は使用しないでください。代わりに`px, rem`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:85:17 `cm`は使用しないでください。代わりに`px, rem`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:95:8 Unexpected value "0 2 calc(100% / 3)" for property "flex" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:98:13 Unexpected value "2" for property "flex-grow" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:101:15 Unexpected value "2" for property "flex-shrink" (declaration-property-value-allowed-list)',
		]);
	});

	test('Component', async () => {
		const violations = await stylelint(
			path.normalize('test/fixtures/stylelint/c-component.css'),
			path.normalize('test/fixtures/stylelint/.stylelintrc.component.json'),
		);

		expect(violations).toStrictEqual([
			'test/fixtures/stylelint/c-component.css:9:1 クラス名がファイル名と一致しないか、コンポーネント命名規則（c-component__）で始まっていません (@d-zero/component)',
			'test/fixtures/stylelint/c-component.css:13:1 クラス名がファイル名と一致しないか、コンポーネント命名規則（c-component__）で始まっていません (@d-zero/component)',
		]);
	});

	test('Component (SCSS)', async () => {
		const violations = await stylelint(
			path.normalize('test/fixtures/stylelint/_c-component.scss'),
			path.normalize('test/fixtures/stylelint/.stylelintrc.component.json'),
		);

		expect(violations).toStrictEqual([
			'test/fixtures/stylelint/_c-component.scss:8:1 クラス名がファイル名と一致しません (@d-zero/component)',
		]);
	});

	test('Transform Properties', async () => {
		const violations = await stylelint(
			path.normalize('test/fixtures/stylelint/transform.scss'),
			path.normalize('test/fixtures/stylelint/.stylelintrc.transform.json'),
		);

		expect(violations).toStrictEqual([
			'test/fixtures/stylelint/transform.scss:3:2 Use individual transform properties instead of "transform: translate(10px, 20px)". Consider: translate: 10px, 20px (@d-zero/prefer-individual-transform-properties)',
			'test/fixtures/stylelint/transform.scss:4:2 Use individual transform properties instead of "transform: rotate(45deg)". Consider: rotate: 45deg (@d-zero/prefer-individual-transform-properties)',
			'test/fixtures/stylelint/transform.scss:5:2 Use individual transform properties instead of "transform: scale(1.5)". Consider: scale: 1.5 (@d-zero/prefer-individual-transform-properties)',
			'test/fixtures/stylelint/transform.scss:6:2 Use individual transform properties instead of "transform: translateX(100px)". Consider: translate: 100px (@d-zero/prefer-individual-transform-properties)',
			'test/fixtures/stylelint/transform.scss:7:2 Use individual transform properties instead of "transform: rotateY(90deg)". Consider: rotate: 90deg (@d-zero/prefer-individual-transform-properties)',
			'test/fixtures/stylelint/transform.scss:8:2 Use individual transform properties instead of "transform: scaleX(2)". Consider: scale: 2 (@d-zero/prefer-individual-transform-properties)',
			'test/fixtures/stylelint/transform.scss:29:2 Use individual transform properties instead of "transform: translate(var(--x), var(--y))". Consider: translate: var(--x), var(--y) (@d-zero/prefer-individual-transform-properties)',
			'test/fixtures/stylelint/transform.scss:30:2 Use individual transform properties instead of "transform: rotate(calc(45deg + 10deg))". Consider: rotate: calc(45deg + 10deg) (@d-zero/prefer-individual-transform-properties)',
			'test/fixtures/stylelint/transform.scss:31:2 Use individual transform properties instead of "transform: scale(calc(1 + 0.5))". Consider: scale: calc(1 + 0.5) (@d-zero/prefer-individual-transform-properties)',
		]);
	});

	test('Shorthand Logical Properties', async () => {
		const violations = await stylelint(
			path.normalize('test/fixtures/stylelint/shorthand-logical.scss'),
		);

		expect(violations).toStrictEqual([
			'test/fixtures/stylelint/shorthand-logical.scss:15:2 Unexpected shorthand property "padding" with multiple values. Consider using logical properties: padding-block, padding-inline (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:16:2 Unexpected shorthand property "padding" with multiple values. Consider using logical properties: padding-block, padding-inline (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:17:2 Unexpected shorthand property "padding" with multiple values. Consider using logical properties: padding-block, padding-inline (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:19:2 Unexpected shorthand property "margin" with multiple values. Consider using logical properties: margin-block, margin-inline (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:20:2 Unexpected shorthand property "margin" with multiple values. Consider using logical properties: margin-block, margin-inline (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:21:2 Unexpected shorthand property "margin" with multiple values. Consider using logical properties: margin-block, margin-inline (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:23:2 Unexpected shorthand property "border-width" with multiple values. Consider using logical properties: border-block-width, border-inline-width (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:24:2 Unexpected shorthand property "border-width" with multiple values. Consider using logical properties: border-block-width, border-inline-width (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:25:2 Unexpected shorthand property "border-width" with multiple values. Consider using logical properties: border-block-width, border-inline-width (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:27:2 Unexpected shorthand property "border-style" with multiple values. Consider using logical properties: border-block-style, border-inline-style (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:28:2 Unexpected shorthand property "border-color" with multiple values. Consider using logical properties: border-block-color, border-inline-color (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:30:2 Unexpected shorthand property "scroll-padding" with multiple values. Consider using logical properties: scroll-padding-block, scroll-padding-inline (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:31:2 Unexpected shorthand property "scroll-margin" with multiple values. Consider using logical properties: scroll-margin-block, scroll-margin-inline (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:33:2 Unexpected shorthand property "border-radius" with multiple values. Consider using logical properties: border-start-start-radius, border-start-end-radius, border-end-start-radius, border-end-end-radius (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:34:2 Unexpected shorthand property "border-radius" with multiple values. Consider using logical properties: border-start-start-radius, border-start-end-radius, border-end-start-radius, border-end-end-radius (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:35:2 Unexpected shorthand property "border-radius" with multiple values. Consider using logical properties: border-start-start-radius, border-start-end-radius, border-end-start-radius, border-end-end-radius (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:38:2 Unexpected shorthand property "padding" with multiple values. Consider using logical properties: padding-block, padding-inline (@d-zero/shorthand-property-use-logical)',
			'test/fixtures/stylelint/shorthand-logical.scss:39:2 Unexpected shorthand property "margin" with multiple values. Consider using logical properties: margin-block, margin-inline (@d-zero/shorthand-property-use-logical)',
		]);
	});

	test('Comment and Rule Spacing', async () => {
		const violations = await stylelint(
			path.normalize('test/fixtures/stylelint/comment-spacing.css'),
		);

		expect(violations).toStrictEqual([
			'test/fixtures/stylelint/comment-spacing.css:5:1 Expected empty line before comment (comment-empty-line-before)',
			'test/fixtures/stylelint/comment-spacing.css:9:1 Expected empty line before rule (rule-empty-line-before)',
		]);
	});
});
