import scopes from '@d-zero/cz-config/scopes';

import { getCZConfig } from './get-cz-config.js';

const cz = await getCZConfig();
const typeEnum = cz?.types?.map((type) => type.value);

const rules = {
	'scope-enum': [2, 'always', scopes],
};

if (typeEnum) {
	rules['type-enum'] = [2, 'always', typeEnum];
}

export default {
	extends: ['@commitlint/config-conventional'],
	rules,
};
