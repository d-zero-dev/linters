import { Linter } from 'eslint';
import { describe, test, expect } from 'vitest';

import plugin from './index.js';

const linter = new Linter();

/**
 * @param {string} code
 * @param {{ jsx?: boolean }} [options]
 */
function lint(code, { jsx = false } = {}) {
	const messages = linter.verify(code, {
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: 'module',
			parserOptions: jsx ? { ecmaFeatures: { jsx: true } } : undefined,
		},
		plugins: { '@d-zero': plugin },
		rules: { '@d-zero/no-click-event': 'error' },
	});

	return messages.map((message) => message.messageId);
}

describe('no-click-event', () => {
	test.each([
		['element.addEventListener("focus", handler)'],
		['element.onfocus = handler'],
		['$element.on("hover", handler)'],
		['document.body.click()'],
		['element.click()'],
		['document.getElementById("btn").click()'],
		['$element.click()'],
		['$(".button").click()'],
		['jQuery("#btn").click()'],
		['button.commandfor = "target-id"'],
		['button.command = "show-modal"'],
	])('valid: %s', (code) => {
		expect(lint(code)).toStrictEqual([]);
	});

	test.each([
		['<button type="button">Click me</button>', { jsx: true }],
		['<button onFocus={handler}>Focus me</button>', { jsx: true }],
	])('valid (jsx): %s', (code, options) => {
		expect(lint(code, options)).toStrictEqual([]);
	});

	test.each([
		['element.addEventListener("click", handler)'],
		["element.addEventListener('click', () => {})"],
	])('invalid: addEventListener pattern - %s', (code) => {
		expect(lint(code)).toStrictEqual(['noClickEvent']);
	});

	test.each([
		['element.onclick = handler'],
		['document.getElementById("btn").onclick = () => {}'],
	])('invalid: onclick property pattern - %s', (code) => {
		expect(lint(code)).toStrictEqual(['noClickEvent']);
	});

	test.each([
		['$element.on("click", handler)'],
		["jQuery('#btn').on('click', function() {})"],
	])('invalid: jQuery .on("click") pattern - %s', (code) => {
		expect(lint(code)).toStrictEqual(['noClickEvent']);
	});

	test.each([
		['$element.click(handler)'],
		['$(".button").click(function() {})'],
		['jQuery("#btn").click(handler)'],
	])('invalid: jQuery .click(handler) pattern - %s', (code) => {
		expect(lint(code)).toStrictEqual(['noClickEvent']);
	});

	test.each([
		['<button onClick={handleClick}>Click me</button>', { jsx: true }],
		['<div onClick={() => console.log("clicked")}>Click</div>', { jsx: true }],
	])('invalid: React onClick pattern - %s', (code, options) => {
		expect(lint(code, options)).toStrictEqual(['noClickEvent']);
	});
});
