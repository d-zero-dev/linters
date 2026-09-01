import type {
	ValueToken,
	KeywordToken,
	PropertyToken,
	TypeToken,
} from '@d-zero/csstree-scss-syntax';
import type { Declaration } from 'postcss';

import CSSTree from '@d-zero/csstree-scss-syntax';
import postcssValueParser from 'postcss-value-parser';

/**
 *
 * @param declaration
 */
export function getValueType(declaration: Declaration) {
	if (declaration.prop.startsWith('$')) {
		return null;
	}
	try {
		return _getValueType(declaration.prop, declaration.value);
	} catch (error) {
		if (
			error instanceof SyntaxError &&
			'source' in error &&
			error.source === declaration.value
		) {
			// Unsupported SCSS syntax by CSSTree
			return null;
		}
		throw error;
	}
}

/**
 *
 * @param property
 * @param value
 */
function _getValueType(
	property: string,
	value: string,
):
	| {
			value: postcssValueParser.Node;
			valueType: string | null;
	  }[]
	| null {
	const valueAst = postcssValueParser(value);
	const valueAstFromCssTree = CSSTree.parse(value, { context: 'value' });
	let cssTreeDeclaration = CSSTree.lexer.matchProperty(property, valueAstFromCssTree);

	if (
		cssTreeDeclaration.error?.message ===
		'Matching for a tree with var() is not supported'
	) {
		value = value.replaceAll(
			/(var\([^)]+\))/g,
			(_, $1) => ' '.repeat($1.length - 1) + '1',
		);
		cssTreeDeclaration = CSSTree.lexer.matchProperty(property, value);
	}

	const replaceableNodeTypes: ReadonlySet<string> = new Set([
		'string',
		'function',
		'word',
	]);
	const values = valueAst.nodes.filter((node) => replaceableNodeTypes.has(node.type));

	// @ts-ignore
	const properties = cssTreeDeclaration.matched;
	if (properties === null) {
		return null;
	}

	const valueTypes = properties.match
		// @ts-ignore
		.flatMap((node) => getValueNode(node))
		// @ts-ignore
		.map((node) => node.syntax.name);

	return values.map((value, index) => {
		const valueType = valueTypes[index] ?? null;

		if (valueType === null && value.type === 'word' && value.value.startsWith('$')) {
			return {
				value: value,
				valueType: '$SASS_VARIABLE',
			};
		}

		return {
			value,
			valueType: valueType ?? 'unknown',
		};
	});
}

/**
 *
 * @param node
 */
function getValueNode(
	node: PropertyToken | TypeToken | KeywordToken,
): (TypeToken | KeywordToken)[] {
	if (isProperty(node) || isType(node)) {
		if (node.match[0].syntax === null) {
			return isProperty(node) ? [] : [node];
		}

		if (isType(node) && node.match.length === 1) {
			return [node];
		}

		return node.match.flatMap((child) =>
			child.syntax === null ? [] : getValueNode(child),
		);
	}
	return [node];
}

/**
 *
 * @param node
 */
function isProperty(
	node: PropertyToken | TypeToken | KeywordToken | ValueToken,
): node is PropertyToken {
	return node.syntax?.type === 'Property';
}

/**
 *
 * @param node
 */
function isType(
	node: PropertyToken | TypeToken | KeywordToken | ValueToken,
): node is TypeToken {
	return node.syntax?.type === 'Type';
}
