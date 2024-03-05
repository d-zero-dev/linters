import type { KeywordToken, PropertyToken, TypeToken } from '@d-zero/csstree-scss-syntax';
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

	const valueTypes = props.match.map((node) => getValueNode(node).syntax.name);

	return values.map((value, i) => {
		const valueType = valueTypes[i] ?? null;

		if (valueType === null) {
			if (value.type === 'word' && value.value.startsWith('$')) {
				return {
					value: value,
					valueType: '$SASS_VARIABLE',
				};
			}

			throw new Error('Value type not found');
		}

		return {
			value,
			valueType,
		};
	});
}

function getValueNode(
	node: PropertyToken | TypeToken | KeywordToken,
): TypeToken | KeywordToken {
	if (isProperty(node)) {
		const firstChild = node.match.at(0)!;
		return getValueNode(firstChild);
	}
	return node;
}

function isProperty(
	node: PropertyToken | TypeToken | KeywordToken,
): node is PropertyToken {
	return node.syntax.type === 'Property';
}
