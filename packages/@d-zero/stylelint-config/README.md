# `@d-zero/stylelint-config`

## 個別インストール

```sh
npm install -D @d-zero/stylelint-config
```

## 使い方

`.stylelintrc`を作成し、[`extends`](https://stylelint.io/user-guide/configure#extends)機能を使って読み込みます。

```json
{
	"extends": ["@d-zero/stylelint-config"]
}
```

### 拡張

プロジェクトに合わせて設定を追加します。

```json
{
	"extends": "@d-zero/stylelint-config",
	"rules": {
		// 例: @ルールで未知のルールを許可する
		"at-rule-no-unknown": null
	}
}
```

## 種類別プリセット

| パッケージパス                    | 用途             |
| --------------------------------- | ---------------- |
| `@d-zero/stylelint-config`        | フルセット       |
| `@d-zero/stylelint-config/base`   | 基本セット       |
| `@d-zero/stylelint-config/name`   | 命名規則         |
| `@d-zero/stylelint-config/order`  | プロパティの順番 |
| `@d-zero/stylelint-config/values` | プロパティ値     |
| `@d-zero/stylelint-config/scss`   | SCSS関連         |

`@d-zero/stylelint-config`はすべてのルールを含んでいるので、一部のルールのみを利用する場合は、それぞれ種類別のものを利用します。

```json
{
	"extends": [
		"@d-zero/stylelint-config/scss",
		"@d-zero/stylelint-config/base",
		"@d-zero/stylelint-config/values"
	]
}
```
