const monorepoScopes = require('./monorepo-scopes');

module.exports = [
	// Packages
	...monorepoScopes([/^@[a-z][\w-]+\//i, /-config$/i]),

	// Others
	'repo',
	'release',
	'deps',
	'changelog',
	'github',
];
