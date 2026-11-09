import type { Rule } from 'eslint';

import { REPOSITORY_URL } from '../const.js';

/**
 * Creates a rule with the D-ZERO namespace and documentation URL
 * @param rule - Rule definition
 * @param rule.name - Rule name, used to build the documentation URL
 * @param rule.meta - Rule metadata
 * @param rule.create - Rule listener factory
 */
export function createRule({
	name,
	meta,
	create,
}: {
	name: string;
	meta: Rule.RuleMetaData;
	create: Rule.RuleModule['create'];
}): Rule.RuleModule {
	return {
		meta: {
			...meta,
			docs: {
				...meta.docs,
				url: `${REPOSITORY_URL}/${name}`,
			},
		},
		create,
	};
}
