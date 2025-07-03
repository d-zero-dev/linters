import postcssValueParser from 'postcss-value-parser';
import stylelint from 'stylelint';
// @ts-ignore
import validateOptions from 'stylelint/lib/utils/validateOptions.mjs';
// @ts-ignore
import { isString, isPlainObject } from 'stylelint/lib/utils/validateTypes.mjs';

import { createRule } from '../../utils/create-rule.js';

// Properties that have logical equivalents and can use shorthand syntax
const SHORTHAND_PROPERTIES_WITH_LOGICAL = [
	'padding',
	'margin',
	'border-width',
	'border-style',
	'border-color',
	'scroll-padding',
	'scroll-margin',
	'border-radius',
] as const;

// Mapping from physical shorthand to logical equivalents
const LOGICAL_PROPERTY_MAP: Record<string, string[]> = {
	padding: ['padding-block', 'padding-inline'],
	margin: ['margin-block', 'margin-inline'],
	'border-width': ['border-block-width', 'border-inline-width'],
	'border-style': ['border-block-style', 'border-inline-style'],
	'border-color': ['border-block-color', 'border-inline-color'],
	'scroll-padding': ['scroll-padding-block', 'scroll-padding-inline'],
	'scroll-margin': ['scroll-margin-block', 'scroll-margin-inline'],
	'border-radius': [
		'border-start-start-radius',
		'border-start-end-radius',
		'border-end-start-radius',
		'border-end-end-radius',
	],
};

/**
 *
 * @param value
 */
function hasMultipleValues(value: string): boolean {
	const parsed = postcssValueParser(value);
	const values = parsed.nodes.filter(
		(node) => node.type === 'word' || node.type === 'function',
	);
	return values.length > 1;
}

type Options = {
	properties?: string[];
};

export default createRule<boolean | Options>({
	name: 'shorthand-property-use-logical',
	rejected: (property: string, logicalProperties: string) =>
		`Unexpected shorthand property "${property}" with multiple values. Consider using logical properties: ${logicalProperties}`,
	rule: (ruleName, messages) => (primary) => {
		return (root, result) => {
			const validOptions = validateOptions(result, ruleName, {
				actual: primary,
				possible: [
					true,
					false,
					(value: unknown) => {
						if (!isPlainObject(value)) return false;
						const obj = value as Record<string, unknown>;
						return !('properties' in obj) ||
							(Array.isArray(obj.properties) && obj.properties.every(isString));
					},
				],
			});

			if (!validOptions || primary === false) {
				return;
			}

			const enabledProperties =
				typeof primary === 'object' && primary.properties
					? primary.properties
					: [...SHORTHAND_PROPERTIES_WITH_LOGICAL];

			root.walkDecls((decl) => {
				// Only check properties that are in our enabled list
				if (!enabledProperties.includes(decl.prop)) {
					return;
				}

				// Check if the property has multiple values
				if (!hasMultipleValues(decl.value)) {
					return;
				}

				// Get logical property suggestions
				const logicalProperties = LOGICAL_PROPERTY_MAP[decl.prop];
				if (!logicalProperties) {
					return;
				}

				stylelint.utils.report({
					result,
					ruleName,
					message: messages.rejected(decl.prop, logicalProperties.join(', ')),
					node: decl,
				});
			});
		};
	},
});
