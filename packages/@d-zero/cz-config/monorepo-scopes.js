const fs = require('node:fs');
const path = require('node:path');

/**
 * Get the list of packages in the monorepo
 * @param {(string | RegExp)[]} removes - Patterns to strip from each package name
 * @returns {string[]} The list of package names
 */
module.exports = function getMonorepoScopes(removes) {
	const cwd = process.cwd();
	const lernaPath = path.resolve(cwd, 'lerna.json');
	if (!fs.existsSync(lernaPath)) {
		return [];
	}
	const lerna = JSON.parse(fs.readFileSync(lernaPath, 'utf8'));
	const packages = fs.globSync(lerna.packages);
	return packages
		.map((packagePath) => {
			let packageJson;
			try {
				packageJson = fs.readFileSync(
					path.resolve(cwd, packagePath, 'package.json'),
					'utf8',
				);
			} catch {
				//
			}
			if (!packageJson) {
				return;
			}
			const package_ = JSON.parse(packageJson);
			let name = package_.name;
			for (const remove of removes) {
				name = name.replace(remove, '');
			}
			return name;
		})
		.filter((name) => name !== undefined);
};
