import type { TSESTree } from '@typescript-eslint/utils';

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
	defaultOptions: [],
	create(context) {
		return {
			// Pattern 1: addEventListener('click', ...)
			'CallExpression[callee.property.name="addEventListener"]'(
				node: TSESTree.CallExpression,
			) {
				const args = node.arguments;
				const firstArg = args[0];
				if (firstArg && firstArg.type === 'Literal' && firstArg.value === 'click') {
					context.report({
						node,
						messageId: 'noClickEvent',
					});
				}
			},

			// Pattern 2: element.onclick = ...
			'AssignmentExpression[left.type="MemberExpression"][left.property.name="onclick"]'(
				node: TSESTree.AssignmentExpression,
			) {
				context.report({
					node,
					messageId: 'noClickEvent',
				});
			},

			// Pattern 3: jQuery .on('click', ...) and .click()
			'CallExpression[callee.type="MemberExpression"]'(node: TSESTree.CallExpression) {
				const callee = node.callee as TSESTree.MemberExpression;

				// .click()
				if (callee.property.type === 'Identifier' && callee.property.name === 'click') {
					context.report({
						node,
						messageId: 'noClickEvent',
					});
				}

				// .on('click', ...)
				const firstArg = node.arguments[0];
				if (
					callee.property.type === 'Identifier' &&
					callee.property.name === 'on' &&
					firstArg &&
					firstArg.type === 'Literal' &&
					firstArg.value === 'click'
				) {
					context.report({
						node,
						messageId: 'noClickEvent',
					});
				}
			},

			// Pattern 4: React onClick={...}
			'JSXAttribute[name.name="onClick"]'(node: TSESTree.JSXAttribute) {
				context.report({
					node,
					messageId: 'noClickEvent',
				});
			},

			// Pattern 5: Vue @click or v-on:click
			// Note: This requires vue-eslint-parser
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			'VAttribute[key.name.name="click"]'(node: any) {
				context.report({
					node,
					messageId: 'noClickEvent',
				});
			},

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			'VAttribute[key.name="on"][key.argument.name="click"]'(node: any) {
				context.report({
					node,
					messageId: 'noClickEvent',
				});
			},
		};
	},
});
