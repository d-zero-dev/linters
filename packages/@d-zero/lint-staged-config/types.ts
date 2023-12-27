export type TargetFileExtension =
	| 'md'
	| 'mdx'
	| 'json'
	| 'yaml'
	| 'yml'
	| 'js'
	| 'cjs'
	| 'mjs'
	| 'jsx'
	| 'ts'
	| 'cts'
	| 'mts'
	| 'tsx'
	| 'html'
	| 'pug'
	| 'css'
	| 'scss'
	| 'astro'
	| 'svelte'
	| 'vue';

export type CommandType =
	| 'cspell'
	| 'eslint'
	| 'markuplint'
	| 'prettier'
	| 'stylelint'
	| 'textlint';

export type CommandMappings = Readonly<
	Partial<Record<TargetFileExtension, CommandType[]>>
>;

/**
 * @see https://github.com/okonet/lint-staged#example-export-a-function-to-build-your-own-matchers
 */
export type LintStagedCommandMapper = (allStagedFiles: readonly string[]) => string[];
