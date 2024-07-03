export type TargetFileExtension =
	| 'astro'
	| 'cjs'
	| 'css'
	| 'cts'
	| 'html'
	| 'js'
	| 'json'
	| 'jsx'
	| 'md'
	| 'mdx'
	| 'mjs'
	| 'mts'
	| 'pug'
	| 'scss'
	| 'svelte'
	| 'ts'
	| 'tsx'
	| 'vue'
	| 'yaml'
	| 'yml';

export type CommandType =
	| 'cspell'
	| 'eslint'
	| 'markuplint'
	| 'prettier'
	| 'puglint'
	| 'stylelint'
	| 'textlint';

export type CommandMappings = Readonly<
	Partial<Record<TargetFileExtension, CommandType[]>>
>;

/**
 * @see https://github.com/okonet/lint-staged#example-export-a-function-to-build-your-own-matchers
 */
export type LintStagedCommandMapper = (allStagedFiles: readonly string[]) => string[];
