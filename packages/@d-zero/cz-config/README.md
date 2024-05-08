# `@d-zero/cz-config`

## 個別インストール

```sh
yarn add -D @d-zero/cz-config
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
