import type {
	ValueToken,
	KeywordToken,
	PropertyToken,
	TypeToken,
} from '@d-zero/csstree-scss-syntax';
import type { Declaration } from 'postcss';

import CSSTree from '@d-zero/csstree-scss-syntax';
import postcssValueParser from 'postcss-value-parser';

export function getValueType(decl: Declaration) {
	if (decl.prop.startsWith('$')) {
		return null;
	}
	return _getValueType(decl.prop, decl.value);
}

function _getValueType(
	prop: string,
	value: string,
):
	| {
			value: postcssValueParser.Node;
			valueType: string | null;
	  }[]
	| null {
	const valueAst = postcssValueParser(value);
	const valueAstFromCssTree = CSSTree.parse(value, { context: 'value' });
	let cssTreeDecl = CSSTree.lexer.matchProperty(prop, valueAstFromCssTree);

	if (cssTreeDecl.error?.message === 'Matching for a tree with var() is not supported') {
		value = value.replaceAll(
			/(var\([^)]+\))/g,
			(_, $1) => ' '.repeat($1.length - 1) + '1',
		);
		cssTreeDecl = CSSTree.lexer.matchProperty(prop, value);
	}

	const values = valueAst.nodes.filter(
		(node) => node.type === 'string' || node.type === 'function' || node.type === 'word',
	);

	const props = cssTreeDecl.matched;
	if (props === null) {
		return null;
	}

	const valueTypes = props.match
		.flatMap((node) => getValueNode(node))
		.map((node) => node.syntax.name);

	return values.map((value, i) => {
		const valueType = valueTypes[i] ?? null;

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

function isProperty(
	node: PropertyToken | TypeToken | KeywordToken | ValueToken,
): node is PropertyToken {
	return node.syntax?.type === 'Property';
}

function isType(
	node: PropertyToken | TypeToken | KeywordToken | ValueToken,
): node is TypeToken {
	return node.syntax?.type === 'Type';
}
