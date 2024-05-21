const scopes = require('./scopes');
const types = require('./types');

module.exports = {
	types: [
		// Default
		types.feat,
		types.fix,
		types.docs,
		types.refactor,
		types.test,
		types.chore,
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
