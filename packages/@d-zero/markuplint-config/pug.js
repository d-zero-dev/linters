import path from 'node:path';

/**
 * @type {import('@markuplint/ml-config').Config}
 */
export default {
	parser: {
		'\\.pug$': '@markuplint/pug-parser',
	},
	overrideMode: 'merge',
	overrides: {
		// overrides の相対パスはこの設定ファイル（node_modules 内）を基準に解決されるため、利用側のプロジェクトを指すよう実行ディレクトリから組み立てる
		[path.resolve(process.cwd(), '**', '*.pug')]: {
			rules: {
				// Pug のテキストの `<` や `&` は Pug がコンパイル時にエスケープの要否を決めるため、HTML として検査すると誤検知になる
				'no-unescaped-char': false,
			},
		},
	},
};
