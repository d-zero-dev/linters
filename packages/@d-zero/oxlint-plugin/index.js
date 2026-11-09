import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(
	readFileSync(new URL('package.json', import.meta.url), 'utf8'),
);

const message =
	'Avoid using click events. Consider using the Invoker Commands API instead. See: https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API';

export default {
	meta: {
		name: '@d-zero/oxlint-plugin',
		version: packageJson.version,
	},
	rules: {
		'no-click-event': {
			meta: {
				type: 'suggestion',
				docs: {
					description: 'Disallow click event handlers in favor of Invoker Commands API',
				},
				messages: {
					noClickEvent: message,
				},
				schema: [],
			},
			create(context) {
				const report = (node) => context.report({ node, messageId: 'noClickEvent' });

				return {
					'CallExpression[callee.property.name="addEventListener"]'(node) {
						if (
							node.arguments[0]?.type === 'Literal' &&
							node.arguments[0].value === 'click'
						) {
							report(node);
						}
					},
					'AssignmentExpression[left.type="MemberExpression"][left.property.name="onclick"]':
						report,
					'CallExpression[callee.type="MemberExpression"][callee.property.name="on"]'(
						node,
					) {
						if (
							node.arguments[0]?.type === 'Literal' &&
							node.arguments[0].value === 'click'
						) {
							report(node);
						}
					},
					'CallExpression[callee.type="MemberExpression"][callee.property.name="click"]'(
						node,
					) {
						if (node.arguments.length === 0) return;
						const object = node.callee.object;
						if (
							(object.type === 'CallExpression' &&
								object.callee.type === 'Identifier' &&
								(object.callee.name === '$' || object.callee.name === 'jQuery')) ||
							(object.type === 'Identifier' && object.name.startsWith('$'))
						) {
							report(node);
						}
					},
					'JSXAttribute[name.name="onClick"]': report,
				};
			},
		},
	},
};
