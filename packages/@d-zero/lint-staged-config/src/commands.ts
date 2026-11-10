import type { CommandType } from './types.js';

export const commands: Record<CommandType, string> = {
	cspell: 'cspell --no-must-find-files --show-suggestions',
	eslint: 'eslint --fix',
	// Markuplint v5 は警告だけなら終了コード 0 で終わるため、Markuplint v4 と同じく警告でもコミットを止める
	markuplint: 'markuplint --no-allow-warnings',
	oxfmt: 'oxfmt --write',
	oxlint: 'oxlint --fix',
	prettier: 'prettier --write',
	puglint: 'pug-lint',
	stylelint: 'stylelint --fix',
	textlint: 'textlint',
};
