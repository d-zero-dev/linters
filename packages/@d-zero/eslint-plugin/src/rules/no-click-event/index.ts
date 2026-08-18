import type { Rule } from 'eslint';
import type { AssignmentExpression, CallExpression, MemberExpression } from 'estree';
import type { AST } from 'vue-eslint-parser';

import { createRule } from '../../utils/create-rule.js';

export default createRule({
	name: 'no-click-event',
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallow click event handlers in favor of Invoker Commands API',
		},
		messages: {
			noClickEvent:
				'Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API',
		},
		schema: [], // No options
	},
	create(context): Rule.RuleListener {
		return {
			// Pattern 1: addEventListener('click', ...)
			'CallExpression[callee.property.name="addEventListener"]'(node: CallExpression) {
				const args = node.arguments;
				const firstArg = args[0];
				if (firstArg && firstArg.type === 'Literal' && firstArg.value === 'click') {
					context.report({
						node: node as unknown as Rule.Node,
						messageId: 'noClickEvent',
					});
				}
			},

			// Pattern 2: element.onclick = ...
			'AssignmentExpression[left.type="MemberExpression"][left.property.name="onclick"]'(
				node: AssignmentExpression,
			) {
				context.report({
					node: node as unknown as Rule.Node,
					messageId: 'noClickEvent',
				});
			},

			// Pattern 3: jQuery .on('click', ...)
			'CallExpression[callee.type="MemberExpression"][callee.property.name="on"]'(
				node: CallExpression,
			) {
				const firstArg = node.arguments[0];
				if (firstArg && firstArg.type === 'Literal' && firstArg.value === 'click') {
					context.report({
						node: node as unknown as Rule.Node,
						messageId: 'noClickEvent',
					});
				}
			},

			// Pattern 4: jQuery .click(handler) - only for jQuery objects with arguments (event handler registration)
			'CallExpression[callee.type="MemberExpression"][callee.property.name="click"]'(
				node: CallExpression,
			) {
				// Allow .click() without arguments (click execution, not event handler registration)
				if (node.arguments.length === 0) {
					return;
				}

				const callee = node.callee as MemberExpression;
				const object = callee.object;

				// $(...).click(handler) or jQuery(...).click(handler)
				if (
					object.type === 'CallExpression' &&
					object.callee.type === 'Identifier' &&
					(object.callee.name === '$' || object.callee.name === 'jQuery')
				) {
					context.report({
						node: node as unknown as Rule.Node,
						messageId: 'noClickEvent',
					});
					return;
				}

				// $element.click(handler)
				if (object.type === 'Identifier' && object.name.startsWith('$')) {
					context.report({
						node: node as unknown as Rule.Node,
						messageId: 'noClickEvent',
					});
				}
			},

			// Pattern 5: React onClick={...}
			// JSXAttribute isn't part of ESTree; espree with jsx enabled produces it, but no type package covers it.
			'JSXAttribute[name.name="onClick"]'(node: unknown) {
				context.report({
					node: node as Rule.Node,
					messageId: 'noClickEvent',
				});
			},

			// Pattern 6: Vue @click or v-on:click
			// Note: This requires vue-eslint-parser
			'VAttribute[key.name.name="click"]'(node: AST.VAttribute) {
				// vue-eslint-parser nodes aren't part of the Rule.Node union context.report expects.
				context.report({
					node: node as unknown as Rule.Node,
					messageId: 'noClickEvent',
				});
			},

			'VAttribute[key.name="on"][key.argument.name="click"]'(node: AST.VAttribute) {
				// vue-eslint-parser nodes aren't part of the Rule.Node union context.report expects.
				context.report({
					node: node as unknown as Rule.Node,
					messageId: 'noClickEvent',
				});
			},
		};
	},
});
