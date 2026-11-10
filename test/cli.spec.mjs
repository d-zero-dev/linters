import path from 'node:path';

import oxlintPlugin from '@d-zero/oxlint-plugin';
import { execa } from 'execa';
import { vi, describe, test, expect } from 'vitest';

import oxlintPluginPackage from '../packages/@d-zero/oxlint-plugin/package.json' with { type: 'json' };

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

/**
 * @param {string} filepath
 * @returns {Promise<{ exitCode: number, lines: string[] }>}
 */
async function oxlint(filepath) {
	const { stdout, exitCode } = await execa(
		'yarn',
		['oxlint', filepath, '--format', 'unix'],
		{
			reject: false,
		},
	);

	return {
		exitCode,
		lines: stdout.split('\n').filter((line) => line.includes(':')),
	};
}

/**
 * @param {string} configFilePath
 * @returns {Promise<Record<string, unknown>>}
 */
async function printOxlintConfig(configFilePath) {
	const { stdout } = await execa('yarn', ['oxlint', '--print-config', configFilePath], {
		reject: false,
	});
	return JSON.parse(stdout);
}

/**
 * @param {string} filepath
 * @param {string} rule
 * @returns {Promise<string[]>}
 */
async function eslint(filepath, rule) {
	const directory = path.dirname(filepath);
	const configFilePath = path.join(directory, 'eslint.config.js');
	const { stdout, stderr } = await execa(
		'npx',
		['eslint', filepath, '--config', configFilePath],
		{
			reject: false,
		},
	);

	if (stderr) {
		throw new Error(stderr);
	}

	const lines = stdout.split('\n');
	return lines
		.filter((line) => line.endsWith(rule))
		.map((line) => line.replaceAll(/\s+/g, ' ').trim());
}

describe('Oxlint', () => {
	test('plugin metadata uses the published package version', () => {
		expect(oxlintPlugin.meta.version).toBe(oxlintPluginPackage.version);
	});

	test('no-click-event', async () => {
		const { exitCode, lines } = await oxlint('test/fixtures/oxlint/no-click-event.tsx');
		// Warning-level rule violations do not make oxlint exit with a failure code.
		expect(exitCode).toBe(0);
		expect(lines).toStrictEqual([
			'test/fixtures/oxlint/no-click-event.tsx:1:1: Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API [Warning/@d-zero(no-click-event)]',
			'test/fixtures/oxlint/no-click-event.tsx:2:9: Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API [Warning/@d-zero(no-click-event)]',
			'test/fixtures/oxlint/no-click-event.tsx:4:1: Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API [Warning/@d-zero(no-click-event)]',
			'test/fixtures/oxlint/no-click-event.tsx:5:1: Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API [Warning/@d-zero(no-click-event)]',
			'test/fixtures/oxlint/no-click-event.tsx:6:1: Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API [Warning/@d-zero(no-click-event)]',
		]);
	});

	test('no-click-event does not detect Vue @click / v-on:click (unsupported in v6)', async () => {
		const { exitCode, lines } = await oxlint('test/fixtures/oxlint/no-click-event.vue');
		expect(exitCode).toBe(0);
		expect(lines).toStrictEqual([]);
	});

	describe('oxlint-config', () => {
		test('promotes the correctness category to error (deny)', async () => {
			const config = await printOxlintConfig('oxlint.config.mts');
			expect(config.categories.correctness).toBe('deny');
		});

		test('sets severity-sensitive rules to deny', async () => {
			const config = await printOxlintConfig('oxlint.config.mts');
			expect(config.rules['no-var']).toBe('deny');
			expect(config.rules['prefer-const']).toBe('deny');
			expect(config.rules['prefer-rest-params']).toBe('deny');
			expect(config.rules['prefer-spread']).toBe('deny');
			expect(config.rules['unicorn/prefer-code-point']).toBe('deny');
			expect(config.rules['typescript/no-namespace']).toBe('deny');
		});

		test('sets severity-sensitive rules to warn', async () => {
			const config = await printOxlintConfig('oxlint.config.mts');
			expect(config.rules['no-console']).toBe('warn');
			expect(config.rules['typescript/no-explicit-any']).toBe('warn');
			expect(config.rules['jsdoc/require-param']).toBe('warn');
		});
	});
});

describe('Prettier', () => {
	test('Astro', async () => {
		const { exitCode, stderr } = await execa(
			'yarn',
			['prettier', '--check', 'test/fixtures/prettier/astro.astro'],
			{ reject: false },
		);

		expect(stderr).toBe('');
		expect(exitCode).toBe(0);
	});
});

describe('ESLint', () => {
	test('sort-class-members', async () => {
		const result = await eslint(
			'test/fixtures/eslint/sort-class-members.js',
			'sort-class-members/sort-class-members',
		);
		expect(result).toStrictEqual([
			'8:2 warning Expected getter getter to come before constructor sort-class-members/sort-class-members',
			'13:2 warning Expected static property staticMember to come before property member sort-class-members/sort-class-members',
			'24:2 warning Expected accessor pair b to come before property #a sort-class-members/sort-class-members',
			'24:2 warning Expected accessor pair b to come before property c1 sort-class-members/sort-class-members',
			'24:2 warning Expected accessor pair b to come before property c2 sort-class-members/sort-class-members',
			'24:2 warning Expected accessor pair b to come before property b2 sort-class-members/sort-class-members',
			'24:2 warning Expected accessor pair b to come before property b1 sort-class-members/sort-class-members',
			'28:2 warning Expected getter a to come before property #a sort-class-members/sort-class-members',
			'28:2 warning Expected getter a to come before property c1 sort-class-members/sort-class-members',
			'28:2 warning Expected getter a to come before property c2 sort-class-members/sort-class-members',
			'28:2 warning Expected getter a to come before property b2 sort-class-members/sort-class-members',
			'28:2 warning Expected getter a to come before property b1 sort-class-members/sort-class-members',
			'32:2 warning Expected getter b to come immediately before setter b sort-class-members/sort-class-members',
			'36:2 warning Expected constructor to come before property #a sort-class-members/sort-class-members',
			'36:2 warning Expected constructor to come before property c1 sort-class-members/sort-class-members',
			'36:2 warning Expected constructor to come before property c2 sort-class-members/sort-class-members',
			'36:2 warning Expected constructor to come before property b2 sort-class-members/sort-class-members',
			'36:2 warning Expected constructor to come before property b1 sort-class-members/sort-class-members',
			'37:2 warning Expected method _method to come before property #a sort-class-members/sort-class-members',
			'37:2 warning Expected method _method to come before property c1 sort-class-members/sort-class-members',
			'37:2 warning Expected method _method to come before property c2 sort-class-members/sort-class-members',
			'37:2 warning Expected method _method to come before property b2 sort-class-members/sort-class-members',
			'37:2 warning Expected method _method to come before property b1 sort-class-members/sort-class-members',
		]);
	});

	test('Disallow DOMContentLoaded', async () => {
		const result = await eslint(
			'test/fixtures/eslint/frontend/dom-content-loaded.js',
			'no-restricted-syntax',
		);
		expect(result).toStrictEqual([
			"1:1 error Avoid using 'DOMContentLoaded'. Use 'defer' or 'type=module' attribute instead no-restricted-syntax",
		]);
	});

	test('no-click-event', async () => {
		const result = await eslint(
			'test/fixtures/eslint/frontend/no-click-event.js',
			'@d-zero/no-click-event',
		);
		expect(result).toStrictEqual([
			'2:1 warning Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API @d-zero/no-click-event',
			'7:2 warning Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API @d-zero/no-click-event',
			'12:1 warning Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API @d-zero/no-click-event',
			'15:1 warning Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API @d-zero/no-click-event',
		]);
	});

	test('regexp', async () => {
		const result = await eslint(
			'test/fixtures/eslint/regexp.js',
			'regexp/no-useless-escape',
		);
		expect(result).toStrictEqual([
			String.raw`1:18 error Unnecessary escape character: \a regexp/no-useless-escape`,
		]);
	});

	test('jsdoc', async () => {
		const result = await eslint('test/fixtures/eslint/jsdoc.js', 'jsdoc/require-jsdoc');
		expect(result).toStrictEqual([
			'1:8 warning Missing JSDoc comment jsdoc/require-jsdoc',
		]);
	});

	test('no-extraneous-dependencies', async () => {
		const result = await eslint(
			'test/fixtures/eslint/no-extraneous-dependencies.js',
			'import-x/no-extraneous-dependencies',
		);
		expect(result).toStrictEqual([
			"1:1 error 'lodash' should be listed in the project's dependencies. Run 'yarn add lodash' to add it import-x/no-extraneous-dependencies",
		]);
	});
});

describe('markuplint', () => {
	/**
	 * @param {string} file Glob of the files to lint
	 * @param {object} [options] Options
	 * @param {string} [options.config] Configuration file passed with `-c`
	 * @param {string[]} [options.args] Extra CLI arguments
	 * @param {Record<string, string>} [options.env] Extra environment variables
	 * @returns {Promise<{ exitCode: number, violations: Record<string, unknown>[] }>} The exit code and the parsed JSON report
	 */
	const runMarkuplintJson = async (file, { config, args = [], env } = {}) => {
		const { stdout, exitCode } = await execa(
			'npx',
			[
				'markuplint',
				file,
				'--format',
				'json',
				'--locale',
				'en',
				config ? ['-c', config] : [],
				args,
			].flat(),
			{
				reject: false,
				env,
			},
		);

		try {
			return { exitCode, violations: JSON.parse(stdout) };
		} catch (error) {
			if (error instanceof SyntaxError) {
				throw new TypeError(`Output is not JSON: ${stdout}`, { cause: error });
			}
			throw error;
		}
	};

	const markuplint = async (file, config) => {
		const { violations } = await runMarkuplintJson(file, { config });
		return violations.map((v) => `${n(v.filePath)}:${v.line}:${v.col} ${v.message}`);
	};

	/**
	 * Runs markuplint and keeps the rule identity, severity and exit code that `markuplint` drops.
	 * @param {string} file Glob of the files to lint
	 * @param {object} [options] Options
	 * @param {string} [options.config] Configuration file passed with `-c`
	 * @param {string[]} [options.args] Extra CLI arguments
	 * @param {Record<string, string>} [options.env] Extra environment variables
	 * @returns {Promise<{ exitCode: number, violations: string[] }>} The exit code and `file:line:col name-or-ruleId severity` lines
	 */
	const markuplintDetails = async (file, options) => {
		const { exitCode, violations } = await runMarkuplintJson(file, options);
		return {
			exitCode,
			violations: violations.map(
				(v) => `${n(v.filePath)}:${v.line}:${v.col} ${v.name ?? v.ruleId} ${v.severity}`,
			),
		};
	};

	test('CLI', async () => {
		const violations = await markuplint('test/fixtures/markuplint/test.*');
		expect(violations).toStrictEqual([
			// Behavior change: 既定の設定が pug パーサーを含まなくなったため、.pug は検査されずに飛ばされる
			// 'test/fixtures/markuplint/test.pug:14:6 The "c-component__invalid-element-nesting" class name is unmatched with the below patterns: "/^c-component2__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!component2)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-component2[a-z0-9]*(?:-[a-z0-9]+)*$/"', // previous
			// 'test/fixtures/markuplint/test.pug:9:4 The "div" element is not allowed in the "span" element in this context', // previous
			// Behavior change: markuplint v5 は WHATWG に従い、セミコロンの無い `&and` を文字参照の誤りとして報告しない
			// 'test/fixtures/markuplint/test.html:17:66 Illegal characters must escape in character reference', // previous
			'test/fixtures/markuplint/test.html:14:18 The "c-component__invalid-element-nesting" class name is unmatched with the below patterns: "/^c-component2__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!component2)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-component2[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/test.html:26:3 The "br" element is disallowed',
			'test/fixtures/markuplint/test.html:9:9 The "div" element is not allowed in the "span" element in this context',
			'test/fixtures/markuplint/test.html:23:3 Require accessible name',
			'test/fixtures/markuplint/test.html:25:3 Require accessible name',
			// Behavior change: D-ZERO 独自の nodeRule が名前付きルールになり、プリセットのルールの後に報告されるため、出力順が変わった
			'test/fixtures/markuplint/test.html:1:1 Require the "h1" element',
			// 'test/fixtures/markuplint/test.html:1:1 Require the "h1" element', // previous（a 要素の href の行の後にあった）
			'test/fixtures/markuplint/test.html:23:3 The "img" element expects the "alt" attribute',
			'test/fixtures/markuplint/test.html:24:3 The "a" element expects the "href" attribute',
			// Behavior change: D-ZERO 独自の nodeRule が名前付きルールになり、プリセットのルールの後に報告されるため、出力順が変わった
			'test/fixtures/markuplint/test.html:25:12 The "href" attribute is matched with the below disallowed patterns: /^javascript:/i',
			// 'test/fixtures/markuplint/test.html:25:12 The "href" attribute is matched with the below disallowed patterns: /^javascript:/i', // previous（br の行の後にあった）
		]);
	});

	test('Extended Naming', async () => {
		const normalConfig = await markuplint('test/fixtures/markuplint/extended-naming.*');
		expect(normalConfig).toStrictEqual([
			// Behavior change: 既定の設定が pug パーサーを含まなくなったため、.pug は検査されずに飛ばされる
			// 'test/fixtures/markuplint/extended-naming.pug:2:2 The "splide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"', // previous
			// 'test/fixtures/markuplint/extended-naming.pug:4:4 The "splide__track" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"', // previous
			// 'test/fixtures/markuplint/extended-naming.pug:5:5 The "splide__list" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"', // previous
			// 'test/fixtures/markuplint/extended-naming.pug:6:6 The "splide__slide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"', // previous
			// 'test/fixtures/markuplint/extended-naming.pug:8:6 The "splide__slide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"', // previous
			// 'test/fixtures/markuplint/extended-naming.pug:10:6 The "splide__slide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"', // previous
			// 'test/fixtures/markuplint/extended-naming.pug:12:4 The "splide__arrows" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"', // previous
			// 'test/fixtures/markuplint/extended-naming.pug:15:29 The "splide__pagination" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"', // previous
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
			// Behavior change: markuplint v5 は src の値を URL として検査し、空白を含む値を報告する
			'test/fixtures/markuplint/image-naming-test.html:21:15 It includes unexpected characters (https://html.spec.whatwg.org/multipage/urls-and-fetching.html#valid-non-empty-url-potentially-surrounded-by-spaces)',
			String.raw`test/fixtures/markuplint/image-naming-test.html:21:15 The "src" attribute is matched with the below disallowed patterns: /[A-Z\s_]/`,
			String.raw`test/fixtures/markuplint/image-naming-test.html:22:15 The "src" attribute is matched with the below disallowed patterns: /[A-Z\s_]/`,
			String.raw`test/fixtures/markuplint/image-naming-test.html:23:15 The "src" attribute is matched with the below disallowed patterns: /[A-Z\s_]/`,
			String.raw`test/fixtures/markuplint/image-naming-test.html:24:15 The "src" attribute is matched with the below disallowed patterns: /[A-Z\s_]/`,
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
			// Behavior change: markuplint v5 は -c で指定した設定だけを読み、.markuplintrc を併せて読まないため、class-naming の違反が報告されない
			// 'test/fixtures/markuplint/button-command.html:27:17 The "btn" class name is unmatched with the below patterns: "/^(?<Prefix>[lpc])-(?<ComponentName>[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/"', // previous
			// 'test/fixtures/markuplint/button-command.html:45:58 The "btn" class name is unmatched with the below patterns: "/^(?<Prefix>[lpc])-(?<ComponentName>[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/"', // previous
			'test/fixtures/markuplint/button-command.html:41:2 Detected perceptible nodes between the trigger and corresponding target',
			'test/fixtures/markuplint/button-command.html:42:2 Detected perceptible nodes between the trigger and corresponding target',
			'test/fixtures/markuplint/button-command.html:102:2 Detected perceptible nodes between the trigger and corresponding target',
			'test/fixtures/markuplint/button-command.html:103:2 Detected perceptible nodes between the trigger and corresponding target',
			'test/fixtures/markuplint/button-command.html:104:2 Detected perceptible nodes between the trigger and corresponding target',
			'test/fixtures/markuplint/button-command.html:111:6 Detected perceptible nodes between the trigger and corresponding target',
			// Behavior change: markuplint v5 は aria-label が要素の内容から得られるアクセシブルな名前を上書きすることを報告する
			'test/fixtures/markuplint/button-command.html:24:2 The accessible name from "aria-label" overrides "content"',
			'test/fixtures/markuplint/button-command.html:47:2 The accessible name from "aria-label" overrides "content"',
			// Behavior change: markuplint v5 は dialog 要素にアクセシブルな名前を要求しない
			// 'test/fixtures/markuplint/button-command.html:110:2 Require accessible name', // previous
			'test/fixtures/markuplint/button-command.html:129:3 Require accessible name',
			// Behavior change: markuplint v5 は show-modal で開く dialog 要素に autofocus 属性を持つ要素を要求する
			'test/fixtures/markuplint/button-command.html:110:2 The "dialog" element referenced by a "show-modal" command requires an element with the "autofocus" attribute',
			// Behavior change: D-ZERO 独自の nodeRule が名前付きルールになり、プリセットのルールの後に報告されるため、出力順が変わった
			'test/fixtures/markuplint/button-command.html:63:16 The "button" role is the implicit role of the "button" element',
			// 'test/fixtures/markuplint/button-command.html:63:16 The "button" role is the implicit role of the "button" element', // previous（末尾にあった）
			// Behavior change: markuplint v5 は tab/menuitem/option ロールに必要な親ロールを検査する
			'test/fixtures/markuplint/button-command.html:54:16 The "tab" role requires an accessibility parent with the "tablist" role',
			'test/fixtures/markuplint/button-command.html:55:16 The "tab" role requires an accessibility parent with the "tablist" role',
			'test/fixtures/markuplint/button-command.html:57:16 The "menuitem" role requires an accessibility parent with one of the roles: "menu", "menubar", "menu > group", "menubar > group"',
			'test/fixtures/markuplint/button-command.html:58:16 The "option" role requires an accessibility parent with one of the roles: "listbox", "listbox > group"',
			'test/fixtures/markuplint/button-command.html:66:16 The "tab" role requires an accessibility parent with the "tablist" role',
			'test/fixtures/markuplint/button-command.html:88:16 The "tab" role requires an accessibility parent with the "tablist" role',
			// Behavior change: D-ZERO 独自の nodeRule が名前付きルールになり、プリセットのルールの後に報告されるため、出力順が変わった
			'test/fixtures/markuplint/button-command.html:55:21 The "aria-selected" ARIA state is not global state',
			// 'test/fixtures/markuplint/button-command.html:55:21 The "aria-selected" ARIA state is not global state', // previous（末尾から 2 つめにあった）
			'test/fixtures/markuplint/button-command.html:18:2 The "button" element expects the "command" attribute',
			'test/fixtures/markuplint/button-command.html:101:2 The "button" element expects the "commandfor" attribute',
			// Behavior change: D-ZERO 独自の nodeRule が名前付きルールになって互いに上書きしなくなったため、popovertarget と popovertargetaction を両方持つボタンで commandfor の欠落も報告される
			'test/fixtures/markuplint/button-command.html:102:2 The "button" element expects the "commandfor" attribute',
			'test/fixtures/markuplint/button-command.html:103:2 The "button" element expects the "commandfor" attribute',
			'test/fixtures/markuplint/button-command.html:104:2 The "button" element expects the "commandfor" attribute',
			'test/fixtures/markuplint/button-command.html:102:2 The "button" element expects the "command" attribute',
			'test/fixtures/markuplint/button-command.html:103:2 The "button" element expects the "command" attribute',
			'test/fixtures/markuplint/button-command.html:104:2 The "button" element expects the "command" attribute',
		]);
	});

	test('Pug config parses .pug files when extended alongside the default config', async () => {
		const violations = await markuplint('test/fixtures/markuplint/pug/*.pug');
		expect(violations).toStrictEqual([
			'test/fixtures/markuplint/pug/test.pug:14:6 The "c-component__invalid-element-nesting" class name is unmatched with the below patterns: "/^c-component2__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!component2)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-component2[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/pug/test.pug:9:4 The "div" element is not allowed in the "span" element in this context',
			'test/fixtures/markuplint/pug/extended-naming.pug:2:2 The "splide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/pug/extended-naming.pug:4:4 The "splide__track" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/pug/extended-naming.pug:5:5 The "splide__list" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/pug/extended-naming.pug:6:6 The "splide__slide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/pug/extended-naming.pug:8:6 The "splide__slide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/pug/extended-naming.pug:10:6 The "splide__slide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/pug/extended-naming.pug:12:4 The "splide__arrows" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/pug/extended-naming.pug:15:29 The "splide__pagination" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
		]);
	});

	test('Pug config turns off character reference checks that the Pug parser would otherwise report', async () => {
		const withoutOverride = await markuplint(
			'test/fixtures/markuplint/pug/character-reference.pug',
			'test/fixtures/markuplint/pug/parser-only.config.js',
		);
		expect(withoutOverride).toStrictEqual([
			'test/fixtures/markuplint/pug/character-reference.pug:3:6 Illegal characters must escape in character reference',
		]);

		const withPugConfig = await markuplint(
			'test/fixtures/markuplint/pug/character-reference.pug',
		);
		expect(withPugConfig).toStrictEqual([]);
	});

	test('Pug config combined with extendsConfig allows added class names and still parses .pug files', async () => {
		const violations = await markuplint(
			'test/fixtures/markuplint/pug/*.pug',
			'test/fixtures/markuplint/pug/extended.config.js',
		);
		expect(violations).toStrictEqual([
			'test/fixtures/markuplint/pug/test.pug:14:6 The "c-component__invalid-element-nesting" class name is unmatched with the below patterns: "/^c-component2__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!component2)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-component2[a-z0-9]*(?:-[a-z0-9]+)*$/", "/^splide(?:__[a-z]+)?$/"',
			'test/fixtures/markuplint/pug/test.pug:9:4 The "div" element is not allowed in the "span" element in this context',
		]);
	});

	test('Pug config combined with nameWith allows added class names and still parses .pug files', async () => {
		const violations = await markuplint(
			'test/fixtures/markuplint/pug/*.pug',
			'test/fixtures/markuplint/pug/extended-naming.config.js',
		);
		expect(violations).toStrictEqual([
			'test/fixtures/markuplint/pug/test.pug:14:6 The "c-component__invalid-element-nesting" class name is unmatched with the below patterns: "/^c-component2__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!component2)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-component2[a-z0-9]*(?:-[a-z0-9]+)*$/", "/^splide(?:__[a-z]+)?$/"',
		]);
	});

	test('Default config skips .pug and .tsx files without reporting anything', async () => {
		const pug = await markuplintDetails('test/fixtures/markuplint/pug/test.pug', {
			config: 'packages/@d-zero/markuplint-config/index.js',
			args: ['--no-allow-warnings'],
		});
		expect(pug).toStrictEqual({ exitCode: 0, violations: [] });

		const tsx = await markuplintDetails('test/fixtures/markuplint/jsx/component.tsx', {
			config: 'packages/@d-zero/markuplint-config/index.js',
			args: ['--no-allow-warnings'],
		});
		expect(tsx).toStrictEqual({ exitCode: 0, violations: [] });
	});

	test('JSX config parses .tsx files, maps className to class naming, reports hard-coded ids, and does not report character references', async () => {
		const violations = await markuplint('test/fixtures/markuplint/jsx/component.tsx');
		expect(violations).toStrictEqual([
			'test/fixtures/markuplint/jsx/component.tsx:7:20 The "c-component__invalid_element" class name is unmatched with the below patterns: "/^c-component__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!component)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-component[a-z0-9]*(?:-[a-z0-9]+)*$/"',
			'test/fixtures/markuplint/jsx/component.tsx:13:4 The "br" element is disallowed',
			'test/fixtures/markuplint/jsx/component.tsx:9:5 The "div" element is not allowed in the "span" element in this context',
			'test/fixtures/markuplint/jsx/component.tsx:11:4 Require accessible name',
			'test/fixtures/markuplint/jsx/component.tsx:14:9 It is hard-coded',
			'test/fixtures/markuplint/jsx/component.tsx:11:4 The "img" element expects the "alt" attribute',
			String.raw`test/fixtures/markuplint/jsx/component.tsx:11:14 The "src" attribute is matched with the below disallowed patterns: /[A-Z\s_]/`,
			'test/fixtures/markuplint/jsx/component.tsx:12:13 The "href" attribute is matched with the below disallowed patterns: /^javascript:/i',
		]);
	});

	test('JSX config reports hard-coded ids only in .jsx/.tsx, not in HTML partials of the same project', async () => {
		const violations = await markuplint('test/fixtures/markuplint/jsx/partial.html');
		expect(violations).toStrictEqual([]);
	});

	test('JSX config parses .jsx files and combines with extendsConfig', async () => {
		const withDefault = await markuplint('test/fixtures/markuplint/jsx/carousel.jsx');
		expect(withDefault).toStrictEqual([
			'test/fixtures/markuplint/jsx/carousel.jsx:3:19 The "splide" class name is unmatched with the below patterns: "/^c-carousel__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!carousel)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-carousel[a-z0-9]*(?:-[a-z0-9]+)*$/"',
		]);

		const withExtendsConfig = await markuplint(
			'test/fixtures/markuplint/jsx/carousel.jsx',
			'test/fixtures/markuplint/jsx/extended.config.js',
		);
		expect(withExtendsConfig).toStrictEqual([]);
	});

	// named-rules.html also holds the inputs the unnamed loosening rules must keep quiet:
	// the OGP prefix on html, an external https script without defer, and an img without width/height
	test('D-ZERO node rules run alongside preset rules, and the loosening rules still apply', async () => {
		const violations = await markuplint(
			'test/fixtures/markuplint/named-rules.html',
			'packages/@d-zero/markuplint-config/base.js',
		);
		expect(violations).toStrictEqual([
			'test/fixtures/markuplint/named-rules.html:12:3 The "img" element expects the "src" or the "srcset" attribute',
			'test/fixtures/markuplint/named-rules.html:11:43 The "accesskey" attribute is disallowed',
			'test/fixtures/markuplint/named-rules.html:13:15 The "accesskey" attribute is disallowed',
			'test/fixtures/markuplint/named-rules.html:14:3 The "button" element expects the "commandfor" attribute',
			'test/fixtures/markuplint/named-rules.html:14:3 The "button" element expects the "command" attribute',
		]);
	});

	test('Base config keeps checks dropped from Markuplint presets and reports non-standard features', async () => {
		const violations = await markuplint(
			'test/fixtures/markuplint/restored-coverage.html',
			'packages/@d-zero/markuplint-config/base.js',
		);
		expect(violations).toStrictEqual([
			'test/fixtures/markuplint/restored-coverage.html:12:4 The name duplicated',
			'test/fixtures/markuplint/restored-coverage.html:15:11 The "src" attribute is ineffective. It doesn\'t need the attribute',
			'test/fixtures/markuplint/restored-coverage.html:16:24 The "incremental" attribute is non-standard',
		]);
	});

	test('Compat preset reports features the browserslist targets lack, except the attributes D-ZERO rules require', async () => {
		const { violations } = await markuplintDetails(
			'test/fixtures/markuplint/compat/unsupported.html',
			{
				config: 'packages/@d-zero/markuplint-config/base.js',
			},
		);
		expect(violations).toStrictEqual([
			'test/fixtures/markuplint/compat/unsupported.html:9:3 no-unsupported-browser-features warning',
			'test/fixtures/markuplint/compat/unsupported.html:11:3 no-unsupported-browser-features warning',
		]);
	});

	test('Compat features can be allowed per project with ignoreFeatures as the README shows', async () => {
		const { violations } = await markuplintDetails(
			'test/fixtures/markuplint/compat/unsupported.html',
			{
				config: 'test/fixtures/markuplint/compat/ignore-features.json',
			},
		);
		expect(violations).toStrictEqual([
			'test/fixtures/markuplint/compat/unsupported.html:9:3 no-unsupported-browser-features warning',
		]);
	});

	test('Extending rules as the README shows keeps the rules of the default config', async () => {
		const violations = await markuplint(
			'test/fixtures/markuplint/test.html',
			'test/fixtures/markuplint/readme-rules.config.js',
		);
		expect(violations).toContain(
			'test/fixtures/markuplint/test.html:26:3 The "br" element is disallowed',
		);
		expect(violations).toContain(
			'test/fixtures/markuplint/test.html:14:18 The "c-component__invalid-element-nesting" class name is unmatched with the below patterns: "/^c-component2__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^[lpc]-(?!component2)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/", "/^c-component2[a-z0-9]*(?:-[a-z0-9]+)*$/", "/^splide(?:__[a-z]+)?$/"',
		);
	});

	test('Turning off a base rule as the README shows also turns off the preset groups that wrap it', async () => {
		const byDefault = await markuplint('test/fixtures/markuplint/unescaped-char.html');
		expect(byDefault).toStrictEqual([
			'test/fixtures/markuplint/unescaped-char.html:9:8 Illegal characters must escape in character reference',
		]);

		const withReadmeRules = await markuplint(
			'test/fixtures/markuplint/unescaped-char.html',
			'test/fixtures/markuplint/readme-rules.config.js',
		);
		expect(withReadmeRules).toStrictEqual([]);
	});

	test('User overrides are merged into the default config instead of replacing it', async () => {
		const violations = await markuplint('test/fixtures/markuplint/overrides/page.html');
		expect(violations).toStrictEqual([
			'test/fixtures/markuplint/overrides/page.html:9:10 The "br" element is disallowed',
		]);
	});

	test('D-ZERO rules report under their d-zero/ names at error severity', async () => {
		const { violations } = await markuplintDetails(
			'test/fixtures/markuplint/d-zero-rules.html',
			{
				config: 'packages/@d-zero/markuplint-config/base.js',
			},
		);
		expect(violations).toStrictEqual([
			'test/fixtures/markuplint/d-zero-rules.html:21:3 a11y/neighbor-popovers warning',
			'test/fixtures/markuplint/d-zero-rules.html:9:3 a11y/require-accessible-name error',
			'test/fixtures/markuplint/d-zero-rules.html:11:3 a11y/media-track error',
			'test/fixtures/markuplint/d-zero-rules.html:12:3 a11y/media-track error',
			'test/fixtures/markuplint/d-zero-rules.html:15:3 a11y/media-track error',
			'test/fixtures/markuplint/d-zero-rules.html:16:3 a11y/media-track error',
			'test/fixtures/markuplint/d-zero-rules.html:9:3 d-zero/img-require-alt error',
			'test/fixtures/markuplint/d-zero-rules.html:10:13 d-zero/img-src-naming error',
			'test/fixtures/markuplint/d-zero-rules.html:11:15 d-zero/media-src-naming error',
			'test/fixtures/markuplint/d-zero-rules.html:11:45 d-zero/media-src-naming error',
			'test/fixtures/markuplint/d-zero-rules.html:13:17 d-zero/media-src-naming error',
			'test/fixtures/markuplint/d-zero-rules.html:15:15 d-zero/media-src-naming error',
			'test/fixtures/markuplint/d-zero-rules.html:17:3 d-zero/a-require-href error',
			'test/fixtures/markuplint/d-zero-rules.html:18:12 d-zero/a-no-javascript-href error',
			'test/fixtures/markuplint/d-zero-rules.html:19:3 d-zero/button-require-command error',
			'test/fixtures/markuplint/d-zero-rules.html:20:3 d-zero/button-require-commandfor error',
			'test/fixtures/markuplint/d-zero-rules.html:21:3 d-zero/button-require-commandfor error',
			'test/fixtures/markuplint/d-zero-rules.html:21:3 d-zero/popovertargetaction-require-command error',
		]);
	});

	test('Missing h1 is a warning in Markuplint v5', async () => {
		const { violations } = await markuplintDetails('test/fixtures/markuplint/test.html');
		expect(violations).toContain(
			'test/fixtures/markuplint/test.html:1:1 a11y/required-h1 warning',
		);
	});

	// Runs with the default output format as @d-zero/lint-staged-config does
	test('--no-allow-warnings makes a file with only warnings fail the run', async () => {
		const runWithDefaultFormat = (args) =>
			execa(
				'npx',
				[
					'markuplint',
					'test/fixtures/markuplint/restored-coverage.html',
					'-c',
					'packages/@d-zero/markuplint-config/base.js',
					...args,
				],
				{ reject: false },
			);

		const allowed = await runWithDefaultFormat([]);
		expect(allowed.exitCode).toBe(0);

		const disallowed = await runWithDefaultFormat(['--no-allow-warnings']);
		expect(disallowed.exitCode).toBe(1);

		const disallowedWithJson = await markuplintDetails(
			'test/fixtures/markuplint/restored-coverage.html',
			{
				config: 'packages/@d-zero/markuplint-config/base.js',
				args: ['--no-allow-warnings'],
			},
		);
		expect(disallowedWithJson.exitCode).toBe(1);
	});

	const dZeroRuleNames = [
		'd-zero/img-require-alt',
		'd-zero/img-src-naming',
		'd-zero/media-src-naming',
		'd-zero/a-require-href',
		'd-zero/a-no-javascript-href',
		'd-zero/button-require-command',
		'd-zero/button-require-commandfor',
		'd-zero/popovertargetaction-require-command',
	];

	test.each(dZeroRuleNames)(
		'%s can be disabled by name without disabling the other D-ZERO rules',
		async (name) => {
			const { violations } = await markuplintDetails(
				'test/fixtures/markuplint/d-zero-rules.html',
				{
					config: 'test/fixtures/markuplint/disable-named-rule.config.js',
					env: { MARKUPLINT_DISABLE_RULE: name },
				},
			);
			const reportedNames = new Set(
				violations.map((v) => v.split(' ')[1]).filter((v) => v.startsWith('d-zero/')),
			);
			expect([...reportedNames].toSorted()).toStrictEqual(
				dZeroRuleNames.filter((n) => n !== name).toSorted(),
			);
		},
	);

	test('An unnamed nodeRule turns off a D-ZERO rule only for the elements it selects, as the README shows', async () => {
		const { violations } = await markuplintDetails(
			'test/fixtures/markuplint/d-zero-rules.html',
			{
				config: 'test/fixtures/markuplint/disable-for-selector.json',
			},
		);
		expect(violations).not.toContain(
			'test/fixtures/markuplint/d-zero-rules.html:17:3 d-zero/a-require-href error',
		);
		expect(violations).toContain(
			'test/fixtures/markuplint/d-zero-rules.html:18:12 d-zero/a-no-javascript-href error',
		);
		expect(violations).toContain(
			'test/fixtures/markuplint/d-zero-rules.html:9:3 d-zero/img-require-alt error',
		);
	});

	test('D-ZERO rules can be disabled by name in the JSON form the README shows', async () => {
		const { violations } = await markuplintDetails(
			'test/fixtures/markuplint/d-zero-rules.html',
			{
				config: 'test/fixtures/markuplint/disable-named-rule.json',
			},
		);
		const reportedNames = new Set(
			violations.map((v) => v.split(' ')[1]).filter((v) => v.startsWith('d-zero/')),
		);
		expect([...reportedNames].toSorted()).toStrictEqual(
			dZeroRuleNames.filter((n) => n !== 'd-zero/button-require-command').toSorted(),
		);
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
			'test/fixtures/stylelint/class-name.scss:1:1 クラス名は「l-」「p-」「c-」のいずれかから始めてください: .component (selector-class-pattern)',
			'test/fixtures/stylelint/class-name.scss:6:2 Stylelint v17以降「&」を使ったセレクタの文字列結合に対応しなくなったため、「&」の使用を禁止します: &__element (selector-nested-pattern)',
			'test/fixtures/stylelint/class-name.scss:10:2 Stylelint v17以降「&」を使ったセレクタの文字列結合に対応しなくなったため、「&」の使用を禁止します: &__invalid__element-name (selector-nested-pattern)',
			'test/fixtures/stylelint/class-name.scss:14:2 Stylelint v17以降「&」を使ったセレクタの文字列結合に対応しなくなったため、「&」の使用を禁止します: &__foo😁bar (selector-nested-pattern)',
			'test/fixtures/stylelint/class-name.scss:18:2 コンポーネントのスタイル定義の中で別のコンポーネントを定義してはいけません: .c-component2 (selector-nested-pattern)',
			'test/fixtures/stylelint/class-name.scss:23:1 スタイル定義でIDセレクタは使わないでください (selector-max-id)',
		]);
	});

	test('Value', async () => {
		const violations = await stylelint(
			path.normalize('test/fixtures/stylelint/values.scss'),
		);

		expect(violations).toStrictEqual([
			'test/fixtures/stylelint/values.scss:8:13 Disallowed value "$size" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/values.scss:9:13 Disallowed value "$base-line-height" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/values.scss:15:15 Unexpected value "10.5%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:16:15 Unexpected value "101%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:17:15 Unexpected value "199%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:18:15 Unexpected value "200%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:19:15 Unexpected value "999%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:20:15 Unexpected value "1000%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:21:34 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/values.scss:22:31 Unexpected value "1vw" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/values.scss:22:32 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
		]);
	});

	test('Value and Unit', async () => {
		const violations = await stylelint(
			path.normalize('test/fixtures/stylelint/unit.scss'),
			path.normalize('test/fixtures/stylelint/.stylelintrc.unit.json'),
		);

		expect(violations).toStrictEqual([
			'test/fixtures/stylelint/unit.scss:12:13 Disallowed value "3em" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:13:13 Disallowed value "1.2em" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:14:13 Disallowed value "0.5em" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:15:13 Disallowed value "4vw" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:15:14 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:20:17 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:23:26 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:26:40 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:32:13 Disallowed value "16px" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:34:13 Disallowed value "16ex" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:34:15 `ex`は使用しないでください。代わりに`em, rem`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:35:13 Disallowed value "16pt" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:35:15 `pt`は使用しないでください。代わりに`px, rem`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:36:13 Disallowed value "16cm" for property "font-size" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:36:15 `cm`は使用しないでください。代わりに`px, rem`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:45:15 Expected "400" to be "normal" (font-weight-notation)',
			'test/fixtures/stylelint/unit.scss:57:16 Disallowed unit (length-zero-no-unit)',
			'test/fixtures/stylelint/unit.scss:63:21 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:64:21 `vh`は使用しないでください。代わりに`svh, dvh, lvh`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:67:15 Unexpected value "5%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:68:15 Unexpected value "50%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:69:14 Unexpected value "33.3%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:72:34 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:74:36 Unexpected value "54.2vw" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:74:40 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:75:23 Unexpected value "2vw" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:75:24 `vw`は使用しないでください。代わりに`svw, dvw, lvw`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:76:23 Unexpected value "50vh" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:76:25 `vh`は使用しないでください。代わりに`svh, dvh, lvh`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:77:19 Unexpected value "105%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:78:19 Unexpected value "120%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:79:19 Unexpected value "200%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:80:19 Unexpected value "1000%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:81:17 Unexpected value "105%" for type "length-percentage" (@d-zero/declaration-value-type-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:83:17 `ex`は使用しないでください。代わりに`em, rem`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:84:17 `pt`は使用しないでください。代わりに`px, rem`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:85:17 `cm`は使用しないでください。代わりに`px, rem`を検討してください。 (unit-disallowed-list)',
			'test/fixtures/stylelint/unit.scss:95:8 Disallowed value "0 2 calc(100% / 3)" for property "flex" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:98:13 Disallowed value "2" for property "flex-grow" (declaration-property-value-allowed-list)',
			'test/fixtures/stylelint/unit.scss:101:15 Disallowed value "2" for property "flex-shrink" (declaration-property-value-allowed-list)',
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
