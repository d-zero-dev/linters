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

export default createRule<Options>({
	name: 'component',
	rule: (ruleName) => (primary) => {
		const allowMultipleSelectors = primary.allowMultipleSelectors ?? false;

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

			// CSSファイルの場合は自動的にallowMultipleSelectorsをtrueにする
			const isCssFile = ext === '.css';
			const effectiveAllowMultipleSelectors = isCssFile || allowMultipleSelectors;

			const rules = root.nodes.filter((node): node is Rule => node.type === 'rule');
			const [firstRule, ...overleftRules] = rules;

			// allowMultipleSelectorsに基づいて複数ルール制約をチェック
			if (!effectiveAllowMultipleSelectors && overleftRules.length > 0) {
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

			const selectors: Selector[] = [];

			selectorParser((parsedRoot) => {
				for (const node of parsedRoot.nodes) {
					selectors.push(node);
				}
			}).processSync(firstRule.selector);

			const [firstSelector, ...multipleSelectors] = selectors;

			if (!firstSelector) {
				throw new Error('Do not have a selector');
			}

			// コンポーネントクラスの検証
			let hasValidComponentClass = false;

			for (const node of firstSelector.nodes) {
				if (node.type === 'class') {
					const className = node.value;

					// 完全一致またはBEM形式（__で始まる）のチェック
					if (
						className === basename ||
						(isCssFile && className.startsWith(`${basename}__`))
					) {
						hasValidComponentClass = true;
						break;
					}
				}
			}

			if (!hasValidComponentClass) {
				stylelint.utils.report({
					result,
					ruleName,
					message: isCssFile
						? `クラス名がファイル名と一致しないか、コンポーネント命名規則（${basename}__）で始まっていません`
						: 'クラス名がファイル名と一致しません',
					node: firstRule,
				});
			}

			if (!effectiveAllowMultipleSelectors && multipleSelectors.length > 0) {
				stylelint.utils.report({
					result,
					ruleName,
					message: 'セレクタの定義は1つだけです',
					node: firstRule,
				});
			}
		};
	},
});
