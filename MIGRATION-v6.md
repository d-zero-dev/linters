# v6 移行ガイド

## Oxlint の導入と ESLint との役割分担

v6 では lint の主軸を Oxlint に切り替えます。Oxlint に実装がない領域（regexp、jsdoc の主要チェック、`import-x/no-extraneous-dependencies`、`no-restricted-syntax`）は、`@d-zero/eslint-config`で ESLint により検査します。

1. `@d-zero/oxlint-config`と`@d-zero/oxlint-plugin`を開発依存に追加します。
2. `oxlint.config.mts`（TypeScript を使わないプロジェクトでは`oxlint.config.mjs`でも可）から共有設定を読み込みます。
3. `oxlint`を lint コマンドとして実行します。

```ts
import config from '@d-zero/oxlint-config';

export default {
	...config,
	jsPlugins: ['@d-zero/oxlint-plugin'],
	rules: {
		...config.rules,
		'@d-zero/no-click-event': 'warn',
	},
};
```

`@d-zero/no-click-event`は JavaScript、TypeScript、JSX、TSX の click event handler を検出します。Vue テンプレートの`@click`と`v-on:click`は v6 から検出しません。

### ESLint の併用

`@d-zero/eslint-config`は Oxlint に実装がない領域（regexp・jsdoc の主要チェック・`import-x/no-extraneous-dependencies`・`import-x/order`・`sort-class-members`・`no-dupe-args`/`no-octal`/`no-redeclare`/`no-undef`）だけを検査します。TypeScript ファイルは対象外です（Oxlint が検査します）。

```js
import dz from '@d-zero/eslint-config';

export default [...dz.configs.base];
```

DOM/Vue/React 向けの`@d-zero/no-click-event`ルールは`frontend`構成にのみ含まれます。

```js
import dz from '@d-zero/eslint-config';

export default [...dz.configs.frontend];
```

## Formatter

JS、TS、JSON、CSS、SCSS、HTML、Markdown、YAML は oxfmt を使用します。Pug と Astro は Prettier を継続使用します。Pug 対応は v7 で廃止予定です。

CI では`yarn lint:ci`を使います。このコマンドはファイルを書き換えず、違反があれば失敗します。ローカルでの自動修正は`yarn lint:fix`を使います。

oxfmt のフォーマットルールはこのリポジトリの`.oxfmtrc.json`にのみ定義しており、`@d-zero/oxfmt-config`のような配布パッケージは現時点で提供していません。他リポジトリで同じルールを再現したい場合は`.oxfmtrc.json`の内容を手動で複製してください。

## lint-staged

`@d-zero/lint-staged-config`の拡張子別コマンドマッピングを Oxlint/oxfmt ベースに変更しました。pre-commit 時の挙動が変わるため、`lint-staged.config.js`を差し替えるだけのプロジェクトでも影響を受けます。

| 拡張子                                      | v5 まで                                            | v6 から                                            |
| ------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- |
| `js` / `ts` / `cjs` / `mjs` / `cts` / `mts` | `eslint --fix` + `prettier --write`                | `oxlint --fix` + `oxfmt --write`                   |
| `jsx` / `tsx` / `vue` / `svelte`            | `eslint --fix` + `markuplint` + `prettier --write` | `oxlint --fix` + `markuplint` + `oxfmt --write`    |
| `astro`                                     | `eslint --fix` + `markuplint` + `prettier --write` | `oxlint --fix` + `markuplint` + `prettier --write` |
| `css` / `scss`                              | `stylelint --fix` + `prettier --write`             | `stylelint --fix` + `oxfmt --write`                |
| `html`                                      | `markuplint` + `prettier --write`                  | `markuplint` + `oxfmt --write`                     |
| `json` / `yaml` / `yml`                     | `prettier --write`                                 | `oxfmt --write`                                    |
| `md` / `mdx`                                | `prettier --write` + `textlint`                    | `oxfmt --write` + `textlint`                       |
| `pug`                                       | `markuplint` + `prettier --write`（変更なし）      | `markuplint` + `prettier --write`（変更なし）      |

詳細な対応表は[`packages/@d-zero/lint-staged-config/src/default-mapping.ts`](./packages/@d-zero/lint-staged-config/src/default-mapping.ts)を参照してください。

## TypeScript 7

TypeScript は 7 系を使用しています。
