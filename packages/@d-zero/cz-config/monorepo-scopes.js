const fs = require('node:fs');
const path = require('node:path');

/**
 * Get the list of packages in the monorepo
 * @param {(string | RegExp)[]} removes
 * @returns {string[]}
 */
module.exports = function (removes) {
	const cwd = process.cwd();
	const lernaPath = path.resolve(cwd, 'lerna.json');
	if (!fs.existsSync(lernaPath)) {
		return [];
	}
	const lerna = JSON.parse(fs.readFileSync(lernaPath, 'utf8'));
	const packages = fs.globSync(lerna.packages);
	return packages
		.map((packagePath) => {
			let packageJson = null;
			try {
				packageJson = fs.readFileSync(
					path.resolve(cwd, packagePath, 'package.json'),
					'utf8',
				);
			} catch {
				//
			}
			if (!packageJson) {
				return null;
			}
			const package_ = JSON.parse(packageJson);
			let name = package_.name;
			for (const remove of removes) {
				name = name.replace(remove, '');
			}
			return name;
		})
		.filter((name) => name !== null);
};
