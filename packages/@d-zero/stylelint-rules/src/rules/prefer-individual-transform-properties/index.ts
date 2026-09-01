import postcssValueParser from 'postcss-value-parser';
import stylelint from 'stylelint';

import { createRule } from '../../utils/create-rule.js';

type Options = {
	/**
	 * Allow complex transforms that cannot be separated
	 */
	allowComplexTransforms?: boolean;
};

/**
 * Transform functions that can be replaced with individual properties
 */
const REPLACEABLE_TRANSFORM_FUNCTIONS = {
	// cspell:disable-next-line
	translate: ['translate', 'translatex', 'translatey', 'translate3d'],
	// cspell:disable-next-line
	rotate: ['rotate', 'rotatex', 'rotatey', 'rotatez', 'rotate3d'],
	// cspell:disable-next-line
	scale: ['scale', 'scalex', 'scaley', 'scale3d'],
};

/**
 * Check if a transform value contains only functions that can be replaced
 * @param value
 */
function analyzeReplaceableTransform(value: string): {
	canReplace: boolean;
	suggestions: string[];
} {
	const parsed = postcssValueParser(value);
	const suggestions: string[] = [];
	const foundTransformTypes = new Set<string>(); // Track types of transforms found
	let hasReplaceableFunction = false;
	let hasNonReplaceableFunction = false;

	parsed.walk((node) => {
		if (node.type === 'function') {
			const functionName = node.value.toLowerCase();
			let isReplaceable = false;

			// Check each category of replaceable functions
			for (const [property, functions] of Object.entries(
				REPLACEABLE_TRANSFORM_FUNCTIONS,
			)) {
				if (functions.includes(functionName)) {
					isReplaceable = true;
					hasReplaceableFunction = true;
					foundTransformTypes.add(property);

					// Generate suggestion based on function type
					const arguments_ = postcssValueParser.stringify(node.nodes);
					suggestions.push(`${property}: ${arguments_}`);
					break;
				}
			}

			if (isReplaceable) {
				// Don't walk into the arguments of transform functions
				return false;
			}
			hasNonReplaceableFunction = true;
		}
		return true;
	});

	// Only suggest replacement if:
	// 1. We found replaceable functions
	// 2. We found no non-replaceable functions
	// 3. We only found ONE type of transform (translate, rotate, or scale)
	const canReplace =
		hasReplaceableFunction &&
		!hasNonReplaceableFunction &&
		foundTransformTypes.size === 1;

	return {
		canReplace,
		suggestions: canReplace ? suggestions : [],
	};
}

export default createRule<Options>({
	name: 'prefer-individual-transform-properties',
	rejected: (value: string, suggestions: string) =>
		`Use individual transform properties instead of "transform: ${value}". Consider: ${suggestions}`,
	rule: (ruleName, messages) => () => {
		return (root, result) => {
			root.walkDecls((declaration) => {
				// Only check transform property
				if (declaration.prop.toLowerCase() !== 'transform') {
					return;
				}

				const { canReplace, suggestions } = analyzeReplaceableTransform(
					declaration.value,
				);

				// If we can replace and have suggestions, report the issue
				if (canReplace && suggestions.length > 0) {
					stylelint.utils.report({
						result,
						ruleName,
						message: messages.rejected(declaration.value, suggestions.join(', ')),
						node: declaration,
					});
				}
			});
		};
	},
});
