import base from './base.js';
import pug from './pug.js';

export default {
	...base,
	...pug,
	plugins: [...(base.plugins ?? []), ...(pug.plugins ?? [])],
	overrides: [...(base.overrides ?? []), ...(pug.overrides ?? [])],
};
