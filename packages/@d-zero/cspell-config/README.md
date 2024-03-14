# `@d-zero/cspell-config`

## 個別インストール

```sh
yarn add -D @d-zero/cspell-config
```

## 使い方

`cspell.json`を作成し、[`import`](https://cspell.org/configuration/imports/#importing-configuration)機能を使って読み込みます。

```json
{
	"import": ["@d-zero/cspell-config"]
}
```

### 拡張

プロジェクトに合わせて設定を追加します。

```json
{
	"import": ["@d-zero/cspell-config"],

	// 例: 単語を追加する
	"words": ["example", "word"]
}
```
