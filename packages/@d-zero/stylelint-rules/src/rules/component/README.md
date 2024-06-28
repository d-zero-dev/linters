# @d-zero/component

ディーゼロのコンポーネントの規定の一部をまとめてチェックするStylelintルールです。

1. コンポーネントのクラス名がファイル名と一致しているか（`_`で開始されるSASSのパーシャルファイル名は`_`を除いて判定されます）
2. 1つのファイルに1つのコンポーネントのみが定義されているか

## Options

`object`: `{ "allowMultipleSelectors": boolean }`

Given:

```json
{
	"allowMultipleSelectors": true
}
```
