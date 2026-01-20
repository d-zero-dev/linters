import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';

import rule from './index.js';

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
			ecmaVersion: 2023,
			sourceType: 'module',
		},
	},
});

ruleTester.run('no-click-event', rule, {
	valid: [
		// Valid: not using click events
		'element.addEventListener("focus", handler)',
		'element.onfocus = handler',
		'$element.on("hover", handler)',
		'$element.focus()',
		'<button type="button">Click me</button>',
		'<button onFocus={handler}>Focus me</button>',

		// Valid: using Invoker Commands API (future-proof examples)
		'button.commandfor = "target-id"',
		'button.command = "show-modal"',
	],
	invalid: [
		// Pattern 1: addEventListener('click')
		{
			code: 'element.addEventListener("click", handler)',
			errors: [{ messageId: 'noClickEvent' }],
		},
		{
			code: "element.addEventListener('click', () => {})",
			errors: [{ messageId: 'noClickEvent' }],
		},

		// Pattern 2: onclick IDL property
		{
			code: 'element.onclick = handler',
			errors: [{ messageId: 'noClickEvent' }],
		},
		{
			code: 'document.getElementById("btn").onclick = () => {}',
			errors: [{ messageId: 'noClickEvent' }],
		},

		// Pattern 3: jQuery .on('click')
		{
			code: '$element.on("click", handler)',
			errors: [{ messageId: 'noClickEvent' }],
		},
		{
			code: "jQuery('#btn').on('click', function() {})",
			errors: [{ messageId: 'noClickEvent' }],
		},

		// Pattern 4: jQuery .click()
		{
			code: '$element.click(handler)',
			errors: [{ messageId: 'noClickEvent' }],
		},
		{
			code: '$(".button").click()',
			errors: [{ messageId: 'noClickEvent' }],
		},

		// Pattern 5: React onClick
		{
			code: '<button onClick={handleClick}>Click me</button>',
			errors: [{ messageId: 'noClickEvent' }],
		},
		{
			code: '<div onClick={() => console.log("clicked")}>Click</div>',
			errors: [{ messageId: 'noClickEvent' }],
		},
	],
});
