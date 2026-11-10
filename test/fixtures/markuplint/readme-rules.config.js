import { extendsConfig } from '@d-zero/markuplint-config';

const config = extendsConfig({
	classNaming: ['/^splide(?:__[a-z]+)?$/'],
});

export default {
	...config,
	rules: {
		...config.rules,
		'no-unescaped-char': false,
	},
};
