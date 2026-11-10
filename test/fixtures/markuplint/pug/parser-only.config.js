import base from '@d-zero/markuplint-config/base';
import pug from '@d-zero/markuplint-config/pug';

export default {
	...base,
	parser: pug.parser,
};
