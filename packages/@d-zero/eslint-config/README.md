# `@d-zero/eslint-config`

## 個別インストール

```sh
yarn add -D @d-zero/eslint-config
```

## 使い方

`.eslintrc`を作成し、[`extends`](https://eslint.org/docs/latest/use/configure/configuration-files#extending-configuration-files)機能を使って読み込みます。

```json
{
	"extends": ["@d-zero/eslint-config"]
}
```

### 拡張

プロジェクトに合わせて設定を追加します。

```json
{
	"extends": ["@d-zero/eslint-config"],
	"rules": {
		// 例: console.logを許可する
		"no-console": 0
	}
}
```

## JavaScriptのみ

:warning: TypeScriptを利用**しない**場合は、`@d-zero/eslint-config`の代わりに`@d-zero/eslint-config/base`を利用します。

```json
{
	"extends": ["@d-zero/eslint-config/base"]
}
```
