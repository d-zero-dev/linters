const types = require('./types');

const base = require('./index');

module.exports = {
	...base,
	types: [
		// Add UI type
		types.feat,
		types.fix,
		types.ui,
		types.style,
		types.docs,
		types.refactor,
		types.test,
		types.chore,
	],
};
