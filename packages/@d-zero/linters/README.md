# `@d-zero/linters`

複数のリンターと共有設定ファイルを含んだ統合リンターパッケージ

このパッケージ自体は空です。依存関係に以下のリンターと設定をリンクしています。

- [`@d-zero/cspell-config`](../cspell-config/)
- [`@d-zero/eslint-config`](../eslint-config/)
- [`@d-zero/lint-staged-config`](../lint-staged-config/)
- [`@d-zero/markuplint-config`](../markuplint-config/)
- [`@d-zero/prettier-config`](../prettier-config/)
- [`@d-zero/pug-lint-config`](../pug-lint-config/)
- [`@d-zero/stylelint-config`](../stylelint-config/)
- [`@d-zero/textlint-config`](../textlint-config/)

このパッケージは各依存パッケージのバージョン管理を簡潔にすることを目的としています。

:warning: プロジェクトによっては各パッケージをバラバラにインストールする方がよいかもしれません。

## インストール

```shell
npm install -D @d-zero/linters
```

## 使い方

プロジェクトで利用するには**設定ファイルを用意する必要があります**。このパッケージに含まれる設定ファイルを利用するには、それぞれの設定ファイルのExtends機能などを利用します。

PrettierがESM形式を要求するため、プロジェクトのモジュールタイプもESM形式にする必要があります。

```json
// package.json
{
	"type": "module"
}
```

### CSpell

`cspell.json`

```json
{
	"import": ["@d-zero/cspell-config"]
}
```

詳細: [`@d-zero/cspell-config`](../cspell-config/)

### ESLint

`.eslintrc`

```json
{
	"extends": ["@d-zero/eslint-config"]
}
```

#### JavaScriptのみ

:warning: TypeScriptを利用**しない**場合は、`@d-zero/eslint-config`の代わりに`@d-zero/eslint-config/base`を利用します。

```json
{
	"extends": ["@d-zero/eslint-config/base"]
}
```

詳細: [`@d-zero/eslint-config`](../eslint-config/)

### lint-staged

`lint-staged.config.mjs`

```js
import lintStagedConfigGenerator from '@d-zero/lint-staged-config';
export default lintStagedConfigGenerator();
```

詳細: [`@d-zero/lint-staged-config`](../lint-staged-config/)

### Markuplint

`.markuplintrc`

```json
{
	"extends": ["@d-zero/markuplint-config"]
}
```

詳細: [`@d-zero/markuplint-config`](../markuplint-config/)

### Prettier

`.prettierrc.mjs`

```js
import config from '@d-zero/prettier-config';

export default config;
```

:warning: CommonJS、JSON、`package.json`からは利用できません。

詳細: [`@d-zero/prettier-config`](../prettier-config/)

### pug-lint

`.pug-lintrc`

```json
{
	"extends": "@d-zero/pug-lint-config"
}
```

詳細: [`@d-zero/pug-lint-config`](../pug-lint-config/)

### Stylelint

`.stylelintrc`

```json
{
	"extends": ["@d-zero/stylelint-config"]
}
```

詳細: [`@d-zero/stylelint-config`](../stylelint-config/)

### textlint

`.textlintrc.js`

```js
module.exports = {
	...require('@d-zero/textlint-config'),
};
```

:warning: 拡張子が`.js`でもCommonJS形式で書きます。ESMには対応していません。

詳細: [`@d-zero/textlint-config`](../textlint-config/)

## サンプルファイル

[./scaffold](./scaffold/)に各設定ファイルのサンプルを用意しています。
