import type { CommandMappings, LintStagedCommandMapper } from './types.js';

import path from 'node:path';

import micromatch from 'micromatch';

import { commands } from './commands.js';
import { defaultMapping } from './default-mapping.js';

export default function (
	dir?: string,
	mapping?: CommandMappings,
): LintStagedCommandMapper {
	return (allStagedFiles) => {
		const commandList: string[] = [];
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
