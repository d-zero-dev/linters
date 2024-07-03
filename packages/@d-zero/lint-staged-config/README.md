# `@d-zero/lint-staged-config`

## 個別インストール

```sh
yarn add -D @d-zero/lint-staged-config
```

## 使い方

`lint-staged.config.mjs`を作成し、読み込んだジェネレーター関数で設定を生成しエクスポートします。

```js
import lintStagedConfigGenerator from '@d-zero/lint-staged-config';
export default lintStagedConfigGenerator();
```

### 拡張

プロジェクトに合わせて設定を追加します。

```js
import lintStagedConfigGenerator, { defaultMapping } from '@d-zero/lint-staged-config';
export default lintStagedConfigGenerator(
	{
		ignore: [path.resolve(process.cwd(), 'dist', '**', '*')],
	},
	{
		...defaultMapping,
		// 例: PHPファイルに対して`markuplint`、`prettier`、`cspell`を実行する
		php: ['markuplint', 'prettier', 'cspell'],
	},
);
```
