import type { Rule, RuleBase } from 'stylelint';

import stylelint from 'stylelint';

import { NAMESPACE, REPOSITORY_URL } from '../const.js';

type Settings<P, S> = {
	name: string;
	rule: (ruleName: string, messages: Messages) => RuleBase<P, S>;
} & Messages;

type Messages = {
	rejected: (...values: string[]) => string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRule<P = any, S = any>(setting: Settings<P, S>) {
	const name = setting.name;
	const ruleName = `${NAMESPACE}/${name}`;
	const meta = {
		url: `${REPOSITORY_URL}/${name}`,
	};

	const messages = stylelint.utils.ruleMessages(ruleName, {
		rejected: setting.rejected,
	});

	const ruleBase = setting.rule(ruleName, messages);

	// @ts-ignore
	const ruleFunction: Rule<P, S> = ruleBase;
	ruleFunction.ruleName = ruleName;
	ruleFunction.meta = meta;
	ruleFunction.messages = messages;

	return stylelint.createPlugin(ruleName, ruleFunction);
}
