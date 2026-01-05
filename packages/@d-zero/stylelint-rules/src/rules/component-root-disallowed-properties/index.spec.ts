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

describe('component-root-disallowed-properties', () => {
	describe('コンポーネントルートでの禁止プロパティチェック', () => {
		describe('width, inline-size', () => {
			test('width が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { width: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('width');
			});

			test('inline-size が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { inline-size: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('inline-size');
			});

			test('min-width は許可されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { min-width: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});

			test('max-width は許可されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { max-width: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});

			test('min-inline-size は許可されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { min-inline-size: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});

			test('max-inline-size は許可されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { max-inline-size: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});
		});

		describe('margin関連', () => {
			test('margin が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { margin: 10px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('margin');
			});

			test('margin-top が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { margin-top: 10px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('margin-top');
			});

			test('margin-block が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { margin-block: 10px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('margin-block');
			});
		});

		describe('height, block-size', () => {
			test('height が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { height: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('height');
			});

			test('block-size が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { block-size: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('block-size');
			});

			test('min-height は許可されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { min-height: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});

			test('max-height は許可されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { max-height: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});

			test('min-block-size は許可されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { min-block-size: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});

			test('max-block-size は許可されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { max-block-size: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});
		});

		describe('inset関連', () => {
			test('inset が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { inset: 0; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('inset');
			});

			test('top が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { top: 0; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('top');
			});
		});

		describe('position', () => {
			test('position: absolute が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { position: absolute; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('position: absolute');
			});

			test('position: fixed が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { position: fixed; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('position: fixed');
			});

			test('position: sticky が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { position: sticky; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('position: sticky');
			});

			test('position: relative は許可されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { position: relative; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});

			test('position: static は許可されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { position: static; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});
		});

		describe('flex関連', () => {
			test('flex が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { flex: 1; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('flex');
			});

			test('flex-grow が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { flex-grow: 1; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('flex-grow');
			});
		});

		describe('その他の禁止プロパティ', () => {
			test('justify-self が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { justify-self: center; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('justify-self');
			});

			test('grid-area が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { grid-area: header; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('grid-area');
			});

			test('float が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { float: left; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('float');
			});

			test('clear が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: '.button { clear: both; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('clear');
			});
		});

		describe('c-content-main クラス', () => {
			test('c-content-main で width が禁止されている', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: '_c-content-main.scss',
					code: '.c-content-main { width: 100px; }',
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('width');
			});
		});
	});

	describe('コンポーネントルート以外ではエラーが出ないこと', () => {
		describe('コンポーネントの子要素', () => {
			test('SCSS: __element で禁止プロパティが使用されていてもエラーが出ない', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: '_c-component.scss',
					code: `.c-component {
						color: red;
					}
					.c-component__element {
						width: 100px;
						margin: 10px;
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});

			test('CSS: __element で禁止プロパティが使用されていてもエラーが出ない', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: `.button {
						color: red;
					}
					.button__text {
						width: 100px;
						margin: 10px;
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});
		});

		describe('ネストされたルール', () => {
			test('SCSS: 子要素（__element）内で禁止プロパティが使用されていてもエラーが出ない', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: '_c-component.scss',
					code: `.c-component {
						color: red;
						&__element {
							width: 100px;
							margin: 10px;
						}
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});

			test('SCSS: 疑似クラス（:hover）内で禁止プロパティが使用されている場合はエラーが出る', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: '_c-component.scss',
					code: `.c-component {
						color: red;
						&:hover {
							position: absolute;
						}
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('position: absolute');
			});
		});

		describe('ファイル名と一致しないクラス名', () => {
			test('ファイル名と一致しないクラス名のルールで禁止プロパティが使用されていてもエラーが出ない', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: `.button {
						color: red;
					}
					.card {
						width: 100px;
						margin: 10px;
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});
		});

		describe('複数のルール', () => {
			test('コンポーネントルート以外のルールで禁止プロパティが使用されていてもエラーが出ない', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: `.button {
						color: red;
					}
					.button__icon {
						width: 16px;
					}
					.button__text {
						margin: 10px;
					}
					.other-class {
						position: absolute;
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});
		});

		describe('疑似クラスの禁止', () => {
			test(':hover 内で禁止プロパティが使用されている場合はエラーが出る', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: `.button {
						&:hover {
							width: 100px;
						}
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('width');
			});

			test(':focus 内で禁止プロパティが使用されている場合はエラーが出る', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: `.button {
						&:focus {
							margin: 10px;
						}
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('margin');
			});

			test(':active 内で禁止プロパティが使用されている場合はエラーが出る', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: `.button {
						&:active {
							height: 100px;
						}
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('height');
			});

			test('複数の疑似クラスが組み合わさっている場合もエラーが出る', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: `.button {
						&:hover:focus {
							position: absolute;
						}
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(1);
				expect(warnings[0].text).toContain('position: absolute');
			});
		});

		describe('疑似要素の許可', () => {
			test('::before 内で禁止プロパティが使用されていてもエラーが出ない', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: `.button {
						&::before {
							width: 100px;
							margin: 10px;
							position: absolute;
						}
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});

			test('::after 内で禁止プロパティが使用されていてもエラーが出ない', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: `.button {
						&::after {
							height: 100px;
							top: 0;
						}
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});

			test('::first-line 内で禁止プロパティが使用されていてもエラーが出ない', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: `.button {
						&::first-line {
							flex: 1;
						}
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});
		});

		describe('疑似クラスと疑似要素の組み合わせ', () => {
			test(':hover::before のような組み合わせの場合、疑似要素が含まれているためエラーが出ない', async () => {
				const {
					// @ts-ignore
					results: [{ warnings, parseErrors }],
				} = await lint({
					codeFilename: 'button.css',
					code: `.button {
						&:hover::before {
							width: 100px;
							position: absolute;
						}
					}`,
					config: config({}),
				});

				expect(parseErrors).toHaveLength(0);
				expect(warnings).toHaveLength(0);
			});
		});
	});
});
