import path from 'node:path';

/**
 * @type {import('@markuplint/ml-config').Config}
 */
export default {
	parser: {
		'\\.[jt]sx$': '@markuplint/jsx-parser',
	},
	specs: {
		'\\.[jt]sx$': '@markuplint/react-spec',
	},
	overrideMode: 'merge',
	overrides: {
		// overrides の相対パスはこの設定ファイル（node_modules 内）を基準に解決されるため、利用側のプロジェクトを指すよう実行ディレクトリから組み立てる
		// JSX に限定するのは、no-hardcoded-id が doctype の無い HTML/Vue/Svelte の部分テンプレートでも報告するため
		[path.resolve(process.cwd(), '**', '*.{jsx,tsx}')]: {
			rules: {
				// markuplint:recommended-react にあり base.js が継承する markuplint:recommended-static-html に無い検査
				// overrides の中には extends を書けず、プリセットごと継承すると .jsx/.tsx 以外にも効くため、グループだけを写す
				'react/no-hard-code-id': {
					rules: {
						'no-hardcoded-id': true,
					},
				},
			},
		},
	},
};
