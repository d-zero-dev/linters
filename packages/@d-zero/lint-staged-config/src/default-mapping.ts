import type { CommandMappings } from './types.js';

export const defaultMapping: CommandMappings = {
	astro: ['eslint', 'markuplint', 'prettier', 'cspell'],
	cjs: ['eslint', 'prettier', 'cspell'],
	css: ['stylelint', 'prettier', 'cspell'],
	cts: ['eslint', 'prettier', 'cspell'],
	html: ['markuplint', 'prettier', 'cspell'],
	js: ['eslint', 'prettier', 'cspell'],
	json: ['prettier', 'cspell'],
	jsx: ['eslint', 'markuplint', 'prettier', 'cspell'],
	md: ['prettier', 'textlint', 'cspell'],
	mdx: ['prettier', 'textlint', 'cspell'],
	mjs: ['eslint', 'prettier', 'cspell'],
	mts: ['eslint', 'prettier', 'cspell'],
	pug: ['markuplint', 'prettier', 'cspell'],
	scss: ['stylelint', 'prettier', 'cspell'],
	svelte: ['eslint', 'markuplint', 'prettier', 'cspell'],
	ts: ['eslint', 'prettier', 'cspell'],
	tsx: ['eslint', 'markuplint', 'prettier', 'cspell'],
	vue: ['eslint', 'markuplint', 'prettier', 'cspell'],
	yaml: ['cspell'],
	yml: ['cspell'],
};
