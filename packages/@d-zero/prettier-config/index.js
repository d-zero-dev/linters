import astro from './astro.js';
import base from './base.js';
import pug from './pug.js';

export default {
	...base,
	...pug,
	...astro,
	plugins: [...(base.plugins ?? []), ...(pug.plugins ?? []), ...(astro.plugins ?? [])],
	overrides: [...(base.overrides ?? []), ...(pug.overrides ?? [])],
};
