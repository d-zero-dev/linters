# `@d-zero/cz-config`

## 個別インストール

```sh
npm install -D @d-zero/cz-config
```

## 使い方

`package.json`に以下を追加します。

```json
{
	"config": {
		"commitizen": {
			"path": "./node_modules/cz-customizable"
		},
		"cz-customizable": {
			"config": "./node_modules/@d-zero/cz-config"
		}
	}
}
```

UI用のコミットタイプ利用したい場合は`@d-zero/cz-config/ui`に変更します。

```diff
		"cz-customizable": {
-			"config": "./node_modules/@d-zero/cz-config"
+			"config": "./node_modules/@d-zero/cz-config/ui"
		}
```
