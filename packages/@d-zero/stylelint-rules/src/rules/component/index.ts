import type { Rule } from 'postcss';
import type { Selector } from 'postcss-selector-parser';

import path from 'node:path';

import selectorParser from 'postcss-selector-parser';
import stylelint from 'stylelint';

import { createRule } from '../../utils/create-rule.js';

type Options = {
	/**
	 * @deprecated
	 */
	allowMultipleSelectors?: boolean;
};

/**
 * セレクタノードがコンポーネントクラス（完全一致または __ で始まる子要素）かどうか判定
 * @param node
 * @param basename
 * @param isCssFile
 */
function isComponentClassNode(
	node: Selector['nodes'][number],
	basename: string,
	isCssFile: boolean,
): boolean {
	if (node.type !== 'class') {
		return false;
	}

	const className = node.value;

	return className === basename || (isCssFile && className.startsWith(`${basename}__`));
}

export default createRule<Options>({
	name: 'component',
	rule: (ruleName) => (primary) => {
		const isAllowMultipleSelectors = primary.allowMultipleSelectors ?? false;

		return (root, result) => {
			const fileName = root.source?.input.file;

			if (!fileName) {
				return;
			}

			const extension = path.extname(fileName);
			const originalBasename = path.basename(fileName, extension);

			const basename = ['.scss', '.sass'].includes(extension)
				? originalBasename.replace(/^_/, '')
				: originalBasename;

			// CSSファイルの場合は自動的にallowMultipleSelectorsをtrueにする
			const isCssFile = extension === '.css';
			const isEffectiveAllowMultipleSelectors = isCssFile || isAllowMultipleSelectors;

			const rules = root.nodes.filter((node): node is Rule => node.type === 'rule');
			const [firstRule, ...overleftRules] = rules;

			// allowMultipleSelectorsに基づいて複数ルール制約をチェック
			if (!isEffectiveAllowMultipleSelectors && overleftRules.length > 0) {
				for (const rule of overleftRules) {
					stylelint.utils.report({
						result,
						ruleName,
						message: '1つのファイルに定義できるコンポーネントクラスは1つだけです',
						node: rule,
					});
				}
			}

			if (!firstRule) {
				stylelint.utils.report({
					result,
					ruleName,
					message: 'コンポーネントが定義されていません',
					node: root,
				});
				return;
			}

			// 全ルールのコンポーネントクラスを検証
			for (const rule of rules) {
				const ruleSelectors: Selector[] = [];
				selectorParser((parsedRoot) => {
					for (const node of parsedRoot.nodes) {
						ruleSelectors.push(node);
					}
				}).processSync(rule.selector);

				const [ruleFirstSelector, ...ruleMultipleSelectors] = ruleSelectors;
				if (!ruleFirstSelector) continue;

				// 完全一致またはコンポーネント命名規則（__で始まる）のチェック
				const hasValidComponentClass = ruleFirstSelector.nodes.some((node) =>
					isComponentClassNode(node, basename, isCssFile),
				);

				if (!hasValidComponentClass) {
					stylelint.utils.report({
						result,
						ruleName,
						message: isCssFile
							? `クラス名がファイル名と一致しないか、コンポーネント命名規則（${basename}__）で始まっていません`
							: 'クラス名がファイル名と一致しません',
						node: rule,
					});
				}

				// 複数セレクタのチェック
				if (!isEffectiveAllowMultipleSelectors && ruleMultipleSelectors.length > 0) {
					stylelint.utils.report({
						result,
						ruleName,
						message: 'セレクタの定義は1つだけです',
						node: rule,
					});
				}
			}
		};
	},
});
