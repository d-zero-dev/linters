import fs from 'node:fs';
import path from 'node:path';

/**
 * @returns {Promise<import('cz-customizable').Options | null>}
 */
export async function getCZConfig() {
	const cwd = process.cwd();
	const packageJson = JSON.parse(
		fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8'),
	);
	const czConfigPath = packageJson?.config?.['cz-customizable']?.config;

	if (!czConfigPath) {
		return null;
	}

	const modulePath = czConfigPath.replace(/^(?:\.\/)?node_modules\//, '');

	let czConfig;

	try {
		czConfig = await import(modulePath);
	} catch {
		return null;
	}

	return czConfig?.default ?? czConfig ?? null;
}
