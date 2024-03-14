# `@d-zero/textlint-config`

## 個別インストール

```sh
yarn add -D @d-zero/textlint-config
```

## 使い方

`.textlintrc.js`を作成し、設定を読み込みエクスポートします。

```js
module.exports = {
	...require('@d-zero/textlint-config'),
};
```

### 拡張

プロジェクトに合わせて設定を追加します。

```js
module.exports = {
	...require('@d-zero/textlint-config'),
	rules: {
		// 例: `no-todo`ルールを無効化
		'no-todo': false,
	},
};
```
