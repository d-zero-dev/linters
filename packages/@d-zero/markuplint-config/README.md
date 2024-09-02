# `@d-zero/markuplint-config`

## 個別インストール

```sh
npm install -D @d-zero/markuplint-config
```

## 使い方

`.markuplintrc`を作成し、[`extends`](https://markuplint.dev/ja/docs/configuration/properties#extends)機能を使って読み込みます。

```json
{
	"extends": ["@d-zero/markuplint-config"]
}
```

### 拡張

プロジェクトに合わせて設定を追加します。

```json
{
	"extends": ["@d-zero/markuplint-config"],
	"rules": {
		// 例: クラス名の命名規則を変更する
		"class-naming": {
			"value": "/^c-(?<ComponentName>[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/"
		}
	}
}
```
