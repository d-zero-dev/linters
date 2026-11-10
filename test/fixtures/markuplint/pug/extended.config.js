import { extendsConfig } from '@d-zero/markuplint-config';

const config = extendsConfig({
	classNaming: ['/^splide(?:__[a-z]+)?$/'],
});

export default {
	...config,
	extends: [...config.extends, '@d-zero/markuplint-config/pug'],
};
