import path from 'node:path';

import micromatch from 'micromatch';

/**
 * lint-staged Config generator
 *
 * @param {string} [dir]
 * @param {import("./types").CommandMappings} [mapping]
 * @return {import("./types").LintStagedCommandMapper}
 */
export default function (dir, mapping) {
	return (allStagedFiles) => {
		/**
		 * @type {string[]}
		 */
		const commandList = [];
		const cwd = process.cwd();

		dir = dir
			? // 絶対パスかどうか
				path.isAbsolute(dir)
				? // 絶対パスならそのまま
					dir
				: // 相対パスなら絶対パスに変換
					path.resolve(cwd, dir)
			: // 引数がないならカレントディレクトリ
				cwd;

		mapping = mapping ?? defaultMapping;

		for (const [ext, commandTypes] of Object.entries(mapping)) {
			for (const commandType of commandTypes) {
				const shell = commands[commandType];

				if (!shell) {
					continue;
				}

				const pattern = path
					.resolve(dir, '**', `{*.${ext},.*.${ext}}`)
					.replaceAll(path.sep, '/');

				const files = allStagedFiles.map((f) => f.replaceAll(path.sep, '/'));

				const targetFiles = micromatch(files, pattern);

				if (targetFiles.length <= 0) {
					continue;
				}

				commandList.push(shell + ' ' + targetFiles.map((f) => `"${f}"`).join(' '));
			}
		}

		return commandList;
	};
}

/**
 * @type {Record<import("./types").CommandType, string>}
 */
export const commands = {
	cspell: 'cspell --no-must-find-files --show-suggestions',
	eslint: 'eslint --fix',
	markuplint: 'markuplint',
	prettier: 'prettier --write',
	puglint: 'pug-lint',
	stylelint: 'stylelint --fix',
};

/**
 * @type {import("./types").CommandMappings}
 */
export const defaultMapping = {
	md: ['prettier', 'textlint', 'cspell'],
	mdx: ['prettier', 'textlint', 'cspell'],
	json: ['prettier', 'cspell'],
	yaml: ['cspell'],
	yml: ['cspell'],
	js: ['eslint', 'prettier', 'cspell'],
	cjs: ['eslint', 'prettier', 'cspell'],
	mjs: ['eslint', 'prettier', 'cspell'],
	jsx: ['eslint', 'markuplint', 'prettier', 'cspell'],
	ts: ['eslint', 'prettier', 'cspell'],
	cts: ['eslint', 'prettier', 'cspell'],
	mts: ['eslint', 'prettier', 'cspell'],
	tsx: ['eslint', 'markuplint', 'prettier', 'cspell'],
	html: ['markuplint', 'prettier', 'cspell'],
	pug: ['markuplint', 'prettier', 'cspell'],
	css: ['stylelint', 'prettier', 'cspell'],
	scss: ['stylelint', 'prettier', 'cspell'],
	astro: ['eslint', 'markuplint', 'prettier', 'cspell'],
	svelte: ['eslint', 'markuplint', 'prettier', 'cspell'],
	vue: ['eslint', 'markuplint', 'prettier', 'cspell'],
};
