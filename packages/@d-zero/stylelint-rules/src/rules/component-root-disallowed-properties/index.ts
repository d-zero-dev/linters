import type { Rule } from 'postcss';
import type { Selector } from 'postcss-selector-parser';

import path from 'node:path';

import selectorParser from 'postcss-selector-parser';
import stylelint from 'stylelint';

import { createRule } from '../../utils/create-rule.js';

// 禁止プロパティのリスト
// string: プロパティ名のみ（例: 'width', 'margin'）
// { [propName: string]: string }: プロパティ名と値のペア（例: { position: 'absolute' }）
const DISALLOWED_PROPERTIES: (string | { [propName: string]: string })[] = [
	'width',
	'inline-size',
	'margin',
	'margin-top',
	'margin-right',
	'margin-bottom',
	'margin-left',
	'margin-block',
	'margin-inline',
	'margin-block-start',
	'margin-block-end',
	'margin-inline-start',
	'margin-inline-end',
	'height',
	'block-size',
	'inset',
	'inset-block',
	'inset-inline',
	'top',
	'right',
	'bottom',
	'left',
	'justify-self',
	'align-self',
	'place-self',
	'flex',
	'flex-grow',
	'flex-shrink',
	'flex-basis',
	'grid-area',
	'float',
	'clear',
	{ position: 'absolute' },
	{ position: 'fixed' },
	{ position: 'sticky' },
];

// min-* と max-* が許可されるプロパティ
const ALLOW_MIN_MAX_PREFIX = ['width', 'inline-size', 'height', 'block-size'] as const;

/**
 * プロパティが禁止されているかチェック
 * @param prop
 */
function isDisallowedProperty(prop: string): boolean {
	const normalizedProp = prop.toLowerCase();
	return DISALLOWED_PROPERTIES.some((item) => {
		if (typeof item === 'string') {
			return item === normalizedProp;
		}
		return false;
	});
}

/**
 * プロパティと値の組み合わせが禁止されているかチェック
 * @param prop
 * @param value
 */
function isDisallowedPropertyValue(prop: string, value: string): boolean {
	const normalizedProp = prop.toLowerCase();
	const normalizedValue = value.toLowerCase().trim();
	return DISALLOWED_PROPERTIES.some((item) => {
		if (typeof item === 'object') {
			return (
				normalizedProp in item && item[normalizedProp]?.toLowerCase() === normalizedValue
			);
		}
		return false;
	});
}

/**
 * min-* または max-* プレフィックスが許可されているかチェック
 * @param prop
 */
function isAllowedMinMaxProperty(prop: string): boolean {
	const normalizedProp = prop.toLowerCase();
	return ALLOW_MIN_MAX_PREFIX.some(
		(allowedProp) =>
			normalizedProp === `min-${allowedProp}` || normalizedProp === `max-${allowedProp}`,
	);
}

/**
 * プロパティが禁止されているかチェック（min-* / max-* の許可を考慮）
 * @param prop
 */
function shouldReportProperty(prop: string): boolean {
	// min-* または max-* が許可されている場合は報告しない
	if (isAllowedMinMaxProperty(prop)) {
		return false;
	}
	return isDisallowedProperty(prop);
}

/**
 * ルールがコンポーネントルートかどうかを判定
 * @param rule
 * @param basename
 */
function isComponentRoot(rule: Rule, basename: string): boolean {
	const ruleSelectors: Selector[] = [];
	selectorParser((parsedRoot) => {
		for (const node of parsedRoot.nodes) {
			ruleSelectors.push(node);
		}
	}).processSync(rule.selector);

	const [ruleFirstSelector] = ruleSelectors;
	if (!ruleFirstSelector) {
		return false;
	}

	for (const node of ruleFirstSelector.nodes) {
		if (node.type === 'class') {
			const className = node.value;

			// ファイル名と完全一致するクラス名のみがコンポーネントルート
			// CSSファイルの場合は __ で始まるクラスは子要素なので除外
			if (className === basename) {
				return true;
			}
		}
	}

	return false;
}

/**
 * ルールのセレクタに疑似クラスが含まれているか判定
 * @param rule
 */
function hasPseudoClass(rule: Rule): boolean {
	let hasPseudo = false;
	selectorParser((parsedRoot) => {
		parsedRoot.walkPseudos((pseudo) => {
			// 疑似クラスは : で始まる（疑似要素は :: で始まる）
			if (pseudo.value.startsWith(':')) {
				hasPseudo = true;
			}
		});
	}).processSync(rule.selector);
	return hasPseudo;
}

/**
 * ルールのセレクタに疑似要素が含まれているか判定
 * @param rule
 */
function hasPseudoElement(rule: Rule): boolean {
	let hasPseudo = false;
	selectorParser((parsedRoot) => {
		parsedRoot.walkPseudos((pseudo) => {
			// 疑似要素は :: で始まる
			if (pseudo.value.startsWith('::')) {
				hasPseudo = true;
			}
		});
	}).processSync(rule.selector);
	return hasPseudo;
}

type Options = Record<string, never>;

export default createRule<Options>({
	name: 'component-root-disallowed-properties',
	rejected: (property: string) =>
		`コンポーネントルートで "${property}" プロパティは禁止されています`,
	rule: (ruleName, messages) => () => {
		return (root, result) => {
			const fileName = root.source?.input.file;

			if (!fileName) {
				return;
			}

			const ext = path.extname(fileName);
			const originalBasename = path.basename(fileName, ext);

			const basename = ['.scss', '.sass'].includes(ext)
				? originalBasename.replace(/^_/, '')
				: originalBasename;

			const rules = root.nodes.filter((node): node is Rule => node.type === 'rule');

			/**
			 * ルール内の宣言をチェックする関数
			 * @param rule
			 */
			const checkDeclarations = (rule: Rule) => {
				for (const node of rule.nodes) {
					if (node.type === 'decl') {
						const prop = node.prop;
						const value = node.value;

						// プロパティと値の組み合わせが禁止されているかチェック
						if (isDisallowedPropertyValue(prop, value)) {
							const normalizedValue = value.toLowerCase().trim();
							stylelint.utils.report({
								result,
								ruleName,
								message: messages.rejected(`${prop}: ${normalizedValue}`),
								node,
							});
							continue;
						}

						// その他の禁止プロパティのチェック
						if (shouldReportProperty(prop)) {
							stylelint.utils.report({
								result,
								ruleName,
								message: messages.rejected(prop),
								node,
							});
						}
					} else if (node.type === 'rule') {
						// ネストされたルールをチェック
						// 疑似要素を含むルールはチェック対象から除外
						if (hasPseudoElement(node)) {
							continue;
						}
						// 疑似クラスを含むルールはチェック対象
						if (hasPseudoClass(node)) {
							checkDeclarations(node);
						}
					}
				}
			};

			// 各ルールをチェック
			for (const rule of rules) {
				// コンポーネントルートかどうかを判定
				if (!isComponentRoot(rule, basename)) {
					continue;
				}

				// コンポーネントルート内の直接の子ノード（宣言）と疑似クラスを含むネストされたルールをチェック
				checkDeclarations(rule);
			}
		};
	},
});
