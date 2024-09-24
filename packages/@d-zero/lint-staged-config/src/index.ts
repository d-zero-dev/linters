import type { CommandMappings, CommandType, LintStagedCommandMapper } from './types.js';

import path from 'node:path';

import micromatch from 'micromatch';

import { commands } from './commands.js';
import { defaultMapping } from './default-mapping.js';

export interface DirectoryOptions {
	/**
	 * ファイルを検索するディレクトリ
	 */
	dir?: string;

	/**
	 * 除外するファイルのパターン
	 */
	ignore?: (string | IgnoreMap)[];
}

export type IgnoreMap = Partial<Record<CommandType, string | string[]>>;

export default function (
	dirOptions?: string | DirectoryOptions,
	mapping?: CommandMappings,
): LintStagedCommandMapper {
	return (allStagedFiles) => {
		const commandList: string[] = [];
		const cwd = process.cwd();

		const dir = typeof dirOptions === 'string' ? dirOptions : dirOptions?.dir;
		const ignore = typeof dirOptions === 'string' ? null : dirOptions?.ignore;

		const baseDir = dir
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
					.resolve(baseDir, '**', `{*.${ext},.*.${ext}}`)
					.replaceAll(path.sep, '/');

				const files = allStagedFiles.map((f) => f.replaceAll(path.sep, '/'));

				let targetFiles = micromatch(files, pattern);

				if (ignore) {
					for (const ignoreMap of ignore) {
						const ignorePattern =
							typeof ignoreMap === 'string' ? ignoreMap : ignoreMap[commandType];
						if (!ignorePattern) {
							continue;
						}
						const ignorePatterns = Array.isArray(ignorePattern)
							? ignorePattern
							: [ignorePattern];
						const absIgnorePatterns = ignorePatterns.map((p) => {
							if (p === path.basename(p)) {
								return path.resolve('**', p).replaceAll(path.sep, '/');
							}
							return path.isAbsolute(p) ? p : path.resolve(baseDir, p);
						});
						targetFiles = micromatch.not(targetFiles, absIgnorePatterns);
					}
				}

				if (targetFiles.length <= 0) {
					continue;
				}

				commandList.push(shell + ' ' + targetFiles.map((f) => `"${f}"`).join(' '));
			}
		}

		return commandList;
	};
}
