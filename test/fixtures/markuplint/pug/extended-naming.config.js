import { nameWith } from '@d-zero/markuplint-config/name';

export default {
	...nameWith(['/^splide(?:__[a-z]+)?$/']),
	extends: ['@d-zero/markuplint-config/pug'],
};
