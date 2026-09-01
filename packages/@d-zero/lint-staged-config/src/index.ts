import type { CommandMappings, CommandType, LintStagedCommandMapper } from './types.js';

import path from 'node:path';

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

/**
 *
 * @param directoryOptions
 * @param mapping
 */
export default function (
	directoryOptions?: string | DirectoryOptions,
	mapping?: CommandMappings,
): LintStagedCommandMapper {
	return (allStagedFiles) => {
		const cwd = process.cwd();

		const directory =
			typeof directoryOptions === 'string' ? directoryOptions : directoryOptions?.dir;
		const ignore = typeof directoryOptions === 'string' ? null : directoryOptions?.ignore;

		const baseDirectory = directory
			? // 絶対パスかどうか
				path.isAbsolute(directory)
				? // 絶対パスならそのまま
					directory
				: // 相対パスなら絶対パスに変換
					path.resolve(cwd, directory)
			: // 引数がないならカレントディレクトリ
				cwd;

		mapping ??= defaultMapping;

		/**
		 *
		 * @param extension
		 * @param commandType
		 */
		function buildCommand(
			extension: string,
			commandType: CommandType,
		): string | undefined {
			const shell = commands[commandType];

			if (!shell) {
				return undefined;
			}

			const pattern = path
				.resolve(baseDirectory, '**', `{*.${extension},.*.${extension}}`)
				.replaceAll(path.sep, '/');

			const files = allStagedFiles.map((f) => f.replaceAll(path.sep, '/'));

			let targetFiles = files.filter((file) => path.matchesGlob(file, pattern));

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
						return path.isAbsolute(p) ? p : path.resolve(baseDirectory, p);
					});
					targetFiles = targetFiles.filter((file) =>
						absIgnorePatterns.every((pattern) => !path.matchesGlob(file, pattern)),
					);
				}
			}

			if (targetFiles.length === 0) {
				return undefined;
			}

			return shell + ' ' + targetFiles.map((f) => `"${f}"`).join(' ');
		}

		const commandList: string[] = [];

		for (const [extension, commandTypes] of Object.entries(mapping)) {
			for (const commandType of commandTypes) {
				const command = buildCommand(extension, commandType);

				if (command) {
					commandList.push(command);
				}
			}
		}

		return commandList;
	};
}
