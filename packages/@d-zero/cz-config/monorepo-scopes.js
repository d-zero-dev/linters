const fs = require('node:fs');
const path = require('node:path');

/**
 * Get the list of packages in the monorepo
 *
 * @param {(string | RegExp)[]} removes
 * @returns {string[]}
 */
module.exports = function (removes) {
	const cwd = process.cwd();
	const lerna = JSON.parse(fs.readFileSync(path.resolve(cwd, 'lerna.json'), 'utf8'));
	const packages = fs.globSync(lerna.packages);
	return packages.map((packagePath) => {
		const pkg = JSON.parse(
			fs.readFileSync(path.resolve(cwd, packagePath, 'package.json'), 'utf8'),
		);
		let name = pkg.name;
		for (const remove of removes) {
			name = name.replace(remove, '');
		}
		return name;
	});
};
