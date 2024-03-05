import stylelint from 'stylelint';
// @ts-ignore
import declarationValueIndex from 'stylelint/lib/utils/declarationValueIndex.mjs';
// @ts-ignore
import matchesStringOrRegExp from 'stylelint/lib/utils/matchesStringOrRegExp.mjs';
// @ts-ignore
import validateObjectWithArrayProps from 'stylelint/lib/utils/validateObjectWithArrayProps.mjs';
// @ts-ignore
import validateObjectWithProps from 'stylelint/lib/utils/validateObjectWithProps.mjs';
// @ts-ignore
import validateOptions from 'stylelint/lib/utils/validateOptions.mjs';
// @ts-ignore
import { isString } from 'stylelint/lib/utils/validateTypes.mjs';

import { createRule } from '../../utils/create-rule.js';
import { getValueType } from '../../utils/get-value-type.js';

type Options = {
	ignoreProperties?: string[];
	patterns: string[];
};

export default createRule<Record<string, string[] | Options>>({
	name: 'declaration-value-type-disallowed-list',
	rejected: (value: string, type: string) =>
		`Unexpected value "${value}" for type "${type}"`,
	rule: (ruleName, messages) => (primary) => {
		return (root, result) => {
			const validOptions = validateOptions(result, ruleName, {
				actual: primary,
				possible: [
					validateObjectWithArrayProps(isString),
					validateObjectWithProps(validateObjectWithArrayProps(isString)),
				],
			});

			if (!validOptions) {
				return;
			}

			const options = Object.entries(primary);

			if (options.length === 0) {
				return;
			}

			root.walkDecls((decl) => {
				const nodes = getValueType(decl);

				if (nodes === null) {
					return;
				}

				for (const node of nodes) {
					if (!node.valueType) {
						continue;
					}

					const checkList = options.flatMap<string>(([key, value]) => {
						const matched = matchesStringOrRegExp(node.valueType, key);
						if (!matched) {
							return [];
						}

						if (Array.isArray(value)) {
							return value;
						}

						if (
							value.ignoreProperties &&
							matchesStringOrRegExp(decl.prop, value.ignoreProperties)
						) {
							return [];
						}

						return value.patterns;
					});

					if (checkList.length === 0) {
						continue;
					}

					const index = declarationValueIndex(decl) + node.value.sourceIndex;
					const endIndex = index + node.value.sourceEndIndex;
					const raw = decl.value.slice(
						node.value.sourceIndex,
						node.value.sourceIndex + node.value.sourceEndIndex,
					);

					if (matchesStringOrRegExp(raw, checkList)) {
						stylelint.utils.report({
							result,
							ruleName,
							message: messages.rejected(raw, node.valueType),
							node: decl,
							index,
							endIndex,
							word: raw,
						});
					}
				}
			});
		};
	},
});
