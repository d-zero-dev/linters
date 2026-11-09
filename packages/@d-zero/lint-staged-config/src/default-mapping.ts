import type { CommandMappings } from './types.js';

export const defaultMapping: CommandMappings = {
	astro: ['oxlint', 'markuplint', 'prettier', 'cspell'],
	cjs: ['oxlint', 'oxfmt', 'cspell'],
	css: ['stylelint', 'oxfmt', 'cspell'],
	cts: ['oxlint', 'oxfmt', 'cspell'],
	html: ['markuplint', 'oxfmt', 'cspell'],
	js: ['oxlint', 'oxfmt', 'cspell'],
	json: ['oxfmt', 'cspell'],
	jsx: ['oxlint', 'markuplint', 'oxfmt', 'cspell'],
	md: ['oxfmt', 'textlint', 'cspell'],
	mdx: ['oxfmt', 'textlint', 'cspell'],
	mjs: ['oxlint', 'oxfmt', 'cspell'],
	mts: ['oxlint', 'oxfmt', 'cspell'],
	pug: ['markuplint', 'prettier', 'cspell'],
	scss: ['stylelint', 'oxfmt', 'cspell'],
	svelte: ['oxlint', 'markuplint', 'oxfmt', 'cspell'],
	ts: ['oxlint', 'oxfmt', 'cspell'],
	tsx: ['oxlint', 'markuplint', 'oxfmt', 'cspell'],
	vue: ['oxlint', 'markuplint', 'oxfmt', 'cspell'],
	yaml: ['oxfmt', 'cspell'],
	yml: ['oxfmt', 'cspell'],
};
