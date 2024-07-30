# `@d-zero/commitlint-config`

## 個別インストール

```sh
npm install -D @d-zero/commitlint-config
```

## 使い方

`.commitlintrc`を作成し、設定を読み込みエクスポートします。

```json
{
	"extends": "@d-zero/commitlint-config"
}
```

### Git Hooks

[Husky](https://typicode.github.io/husky/)に対応する場合、以下の内容で`.husky/commit-msg`ファイルを作成します。

```sh
#!/bin/sh
npm run commitlint --edit "$1"
```
