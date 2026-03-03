import { ESLintUtils } from '@typescript-eslint/utils';

import { REPOSITORY_URL } from '../const.js';

/**
 * Creates a rule with the D-ZERO namespace and documentation URL
 */
export const createRule = ESLintUtils.RuleCreator((name) => `${REPOSITORY_URL}/${name}`);
