const base = require('./base');
const name = require('./name');
const order = require('./order');
const values = require('./values');

module.exports = {
	...base,
	extends: [...base.extends, ...order.extends],
	plugins: [...base.plugins, ...order.plugins],
	ignoreFiles: ['**/*.{js,jsx,ts,tsx,html,pug}', 'htdocs/**/*', 'docs/**/*.md'],
	rules: {
		...base.rules,
		...order.rules,
		...name.rules,
		...values.rules,
	},
};
