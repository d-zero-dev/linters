const base = require('./base');
const name = require('./name');
const values = require('./values');

module.exports = {
	...base,
	ignoreFiles: [
		'__assets/**/*.{js,jsx,ts,tsx,html,pug}',
		'__assets/css/_syntax-rules.scss',
		'htdocs/**/*',
		'docs/**/*.md',
	],
	rules: {
		...base.rules,
		...name.rules,
		...values.rules,
	},
};
