const monorepoScopes = require('./monorepo-scopes');

module.exports = [
	// Packages
	...monorepoScopes([/^@d-zero\//i, /-config$/i]),

	// Others
	'release',
	'deps',
	'changelog',
	'github',
];
