# `@d-zero/lint-staged-config`

## 個別インストール

```sh
npm install -D @d-zero/lint-staged-config
```

## 使い方

`lint-staged.config.mjs`を作成し、読み込んだジェネレーター関数で設定を生成しエクスポートします。

```js
import lintStagedConfigGenerator from '@d-zero/lint-staged-config';
export default lintStagedConfigGenerator();
```

### Markuplint

Markuplint v5 を前提に、`markuplint`は`--no-allow-warnings`付きで実行し、警告（`warning`）でもコミットを止めます。コマンドの文字列は変更できないため、警告で止めたくない場合は、該当するルールの severity をMarkuplintの設定で変えてください。

Markuplintは、パーサーが設定されていない拡張子のファイルを**エラーにせず黙って飛ばします**。既定のマッピングは`.pug`/`.jsx`/`.tsx`/`.vue`/`.svelte`/`.astro`も`markuplint`に渡すため、これらを検査するにはMarkuplintの設定で対応するパーサーを読み込んでください。表のパッケージは`@d-zero/markuplint-config`の依存に含まれないので、使うものを開発依存に追加します。

| 拡張子          | Markuplintの設定                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `.pug`          | `@markuplint/pug-parser`を追加し`@d-zero/markuplint-config/pug`をextends                           |
| `.jsx` / `.tsx` | `@markuplint/jsx-parser`と`@markuplint/react-spec`を追加し`@d-zero/markuplint-config/jsx`をextends |
| `.vue`          | `@markuplint/vue-parser`と`@markuplint/vue-spec`を設定                                             |
| `.svelte`       | `@markuplint/svelte-parser`と`@markuplint/svelte-spec`を設定                                       |
| `.astro`        | `@markuplint/astro-parser`を設定                                                                   |

### 拡張

プロジェクトに合わせて設定を追加します。

```js
import lintStagedConfigGenerator, { defaultMapping } from '@d-zero/lint-staged-config';
export default lintStagedConfigGenerator(
	{
		ignore: [path.resolve(process.cwd(), 'dist', '**', '*')],
		{
			// 例: `CHANGELOG.md`に対してのみ`textlint`を除外する
			textlint: "CHANGELOG.md",
		}
	},
	{
		...defaultMapping,
		// 例: PHPファイルに対して`markuplint`、`prettier`、`cspell`を実行する
		php: ['markuplint', 'prettier', 'cspell'],
	},
);
```
