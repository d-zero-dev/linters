const scopes = require('./scopes');

module.exports = {
	types: [
		{
			value: 'feat',
			name: 'feat:     機能追加',
			title: 'Features',
		},
		{
			value: 'fix',
			name: 'fix:      バグ修正',
			title: 'Bug Fixes',
		},
		{
			value: 'docs',
			name: 'docs:     ドキュメントのみの変更',
			title: 'Documentation',
		},
		{
			value: 'refactor',
			name: 'refactor: バグの修正や機能の追加ではないコードの変更',
			title: 'Code Refactoring',
		},
		{
			value: 'test',
			name: 'test:     テストの追加や既存のテストの修正',
			title: 'Tests',
		},
		{
			value: 'chore',
			name: 'chore:    ビルドプロセスや補助ツールやライブラリの変更',
			title: 'Chores',
		},
	],
	scopes: scopes.map((scope) => ({
		name: scope,
	})),
	messages: {
		type: 'コミットする変更タイプを選択してください:\n',
		scope: '変更内容のスコープ:\n',
		subject: 'コミット内容について入力してください:\n',
		breaking: '破壊的変更がある場合は記述してください:\n',
		confirmCommit: 'こちらの内容でコミットを実行してよろしいですか？:\n',
	},
	skipQuestions: ['body', 'footer'],
	allowBreakingChanges: ['feat', 'fix'],
};
