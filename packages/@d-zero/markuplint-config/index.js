import base from './base.js';
import nameConfig, { nameWith } from './name.js';

const createConfig = (name = nameConfig) => {
	return {
		...base,
		...name,
		parser: {
			...base.parser,
			...name.parser,
		},
		rules: {
			...base.rules,
			...name.rules,
		},
		nodeRules: [
			//
			...(base.nodeRules ?? []),
			...(name.nodeRules ?? []),
		],
		childNodeRules: [
			//
			...(base.childNodeRules ?? []),
			...(name.childNodeRules ?? []),
		],
		// Markuplint の既定は reset で、利用側が overrides を書くと一致したファイルではこの設定がすべて外れるため
		overrideMode: 'merge',
	};
};

/**
 * @type {import('@markuplint/ml-config').Config}
 */
export default createConfig();

/**
 * 既定の設定に、許可するクラス名のパターンを足した設定を返します。
 *
 * `class-naming`は値が配列のうえ、コンポーネント内の要素を検査する`childNodeRules`にも同じパターンを足す必要があり、
 * `rules`で直接上書きすると冗長になるため、この関数で既定のパターンに追加します。
 *
 * 戻り値は既定の設定と同じ形で、`extends`（Markuplintのプリセット）と`rules`を含みます。
 * Pug/JSXの設定や独自のルールと組み合わせるときは、`extends`と`rules`を上書きせずに展開してください。
 * @param {object} options 設定のオプション
 * @param {string[]} [options.classNaming] 既定の命名規則に加えて許可するクラス名の正規表現（`/.../`形式の文字列）
 * @returns {import('@markuplint/ml-config').Config} Markuplintの設定
 * @example
 * ```js
 * import { extendsConfig } from '@d-zero/markuplint-config';
 *
 * const config = extendsConfig({
 * 	classNaming: ['/^splide(?:__[a-z]+)?$/'],
 * });
 *
 * export default {
 * 	...config,
 * 	extends: [...config.extends, '@d-zero/markuplint-config/pug'],
 * 	rules: {
 * 		...config.rules,
 * 		'no-unescaped-char': false,
 * 	},
 * };
 * ```
 */
export const extendsConfig = (options) => {
	const name = options?.classNaming ? nameWith(options.classNaming) : nameConfig;
	return createConfig(name);
};
