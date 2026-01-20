import noClickEvent from './rules/no-click-event/index.js';

const plugin = {
	meta: {
		name: '@d-zero/eslint-plugin',
		version: '5.0.0',
	},
	rules: {
		'no-click-event': noClickEvent,
	},
};

export default plugin;
