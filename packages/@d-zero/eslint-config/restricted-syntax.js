/**
 * @type {[selector: string, message: string][]}
 */
export const restrictedSyntax = [
	{
		selector:
			"CallExpression[callee.property.name='addEventListener'][arguments.0.value='DOMContentLoaded']",
		message:
			"Avoid using 'DOMContentLoaded'. Use 'defer' or 'type=module' attribute instead.",
	},
];
