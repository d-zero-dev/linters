import type { CommandType } from './types.js';

export const commands: Record<CommandType, string> = {
	cspell: 'cspell --no-must-find-files --show-suggestions',
	eslint: 'eslint --fix',
	markuplint: 'markuplint',
	prettier: 'prettier --write',
	puglint: 'pug-lint',
	stylelint: 'stylelint --fix',
	textlint: 'textlint',
};
