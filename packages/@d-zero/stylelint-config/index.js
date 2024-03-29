const base = require('./base');
const name = require('./name');
const order = require('./order');
const scss = require('./scss');
const values = require('./values');

module.exports = {
	...scss,
	...base,
	extends: [...base.extends, ...order.extends],
	plugins: [...scss.plugins, ...base.plugins, ...order.plugins, ...values.plugins],
	ignoreFiles: ['**/*.{js,jsx,ts,tsx,html,pug}', 'htdocs/**/*', 'docs/**/*.md'],
	rules: {
		...base.rules,
		...order.rules,
		...name.rules,
		...values.rules,
		...scss.rules,
	},
};
