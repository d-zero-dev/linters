import type { Rule } from 'postcss';
import type { Selector } from 'postcss-selector-parser';

import path from 'node:path';

import selectorParser from 'postcss-selector-parser';
import stylelint from 'stylelint';

import { createRule } from '../../utils/create-rule.js';

type Options = {
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

			const rules = root.nodes.filter((node): node is Rule => node.type === 'rule');
			const [firstRule, ...overleftRules] = rules;

			for (const rule of overleftRules) {
				stylelint.utils.report({
					result,
					ruleName,
					message: '1つのファイルに定義できるコンポーネントクラスは1つだけです',
					node: rule,
				});
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

			for (const node of firstSelector.nodes) {
				if (node.type === 'class') {
					const className = node.value;

					if (className !== basename) {
						stylelint.utils.report({
							result,
							ruleName,
							message: 'クラス名がファイル名と一致しません',
							node: firstRule,
						});
					}
				}
			}

			if (!allowMultipleSelectors && multipleSelectors.length > 0) {
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
