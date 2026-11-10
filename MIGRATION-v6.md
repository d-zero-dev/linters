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

| 拡張子                                      | v5 まで                                            | v6 から                                                                |
| ------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------- |
| `js` / `ts` / `cjs` / `mjs` / `cts` / `mts` | `eslint --fix` + `prettier --write`                | `oxlint --fix` + `oxfmt --write`                                       |
| `jsx` / `tsx` / `vue` / `svelte`            | `eslint --fix` + `markuplint` + `prettier --write` | `oxlint --fix` + `markuplint --no-allow-warnings` + `oxfmt --write`    |
| `astro`                                     | `eslint --fix` + `markuplint` + `prettier --write` | `oxlint --fix` + `markuplint --no-allow-warnings` + `prettier --write` |
| `css` / `scss`                              | `stylelint --fix` + `prettier --write`             | `stylelint --fix` + `oxfmt --write`                                    |
| `html`                                      | `markuplint` + `prettier --write`                  | `markuplint --no-allow-warnings` + `oxfmt --write`                     |
| `json` / `yaml` / `yml`                     | `prettier --write`                                 | `oxfmt --write`                                                        |
| `md` / `mdx`                                | `prettier --write` + `textlint`                    | `oxfmt --write` + `textlint`                                           |
| `pug`                                       | `markuplint` + `prettier --write`                  | `markuplint --no-allow-warnings` + `prettier --write`                  |

詳細な対応表は[`packages/@d-zero/lint-staged-config/src/default-mapping.ts`](./packages/@d-zero/lint-staged-config/src/default-mapping.ts)を参照してください。

`markuplint`には`--no-allow-warnings`が付きます。Markuplint v5 は警告だけなら終了コード0で終わるため、v5 まで（Markuplint v4）と同じく警告でもコミットを止めます。旧ルール名を使っている設定は、Markuplint v5 が出す非推奨の警告でもコミットが止まるので、次節の対応表で書き換えてください。

Markuplint はパーサーが設定されていない拡張子のファイルを黙って飛ばします。`.pug`/`.jsx`/`.tsx`/`.vue`/`.svelte`/`.astro`を検査するには、Markuplint の設定で対応するパーサーを読み込んでください（[`@d-zero/lint-staged-config`の README](./packages/@d-zero/lint-staged-config/README.md#markuplint)）。

## Markuplint v5

`@d-zero/markuplint-config`は Markuplint v5 を使います。Markuplint 自体の変更は[上流の移行ガイド](https://markuplint.dev/docs/migration/v4-to-v5)を参照してください。このパッケージを使う側に関わる変更は次のとおりです。

- **Node.js 24 以上が必要です**。Markuplint v5 の要件で、このパッケージだけが対象です（他の`@d-zero/*`は Node.js 22 以上のまま）
- **Pug は既定の設定から外れました**。`.pug`を検査するには`@d-zero/markuplint-config/pug`を extends し、`@markuplint/pug-parser`を開発依存に追加してください。追加しないと`.pug`は黙って飛ばされます
- **JSX/TSX 用の`@d-zero/markuplint-config/jsx`を追加しました**。`@markuplint/jsx-parser`と`@markuplint/react-spec`を開発依存に追加して extends します。TypeScript 7 のプロジェクトでは追加の設定が要ります（[README](./packages/@d-zero/markuplint-config/README.md#jsx--react)）
- **D-ZERO 独自ルールは`d-zero/`で始まる名前付きルールになりました**。違反の出力にこの名前が表示され、`rules`で`"d-zero/button-require-command": false`のように個別に無効化できます。出力順も変わります
- **`markuplint:compat`を追加しました**。browserslist の設定があるプロジェクトでは、対象ブラウザーが対応していない機能を警告します
- **`no-ineffective-attr`と`no-duplicate-dt`は引き続き有効です**（Markuplint v5 のプリセットからは外れました）
- **`require-h1`などの severity が`error`から`warning`に下がりました**（[一覧](https://markuplint.dev/docs/migration/v4-to-v5/rules/rule-names#severity-changes)）
- **`markuplint -c <file>`は指定したファイルだけを読みます**。v4 は`.markuplintrc`も合わせて読んでいました

設定で旧ルール名を使っている場合は書き換えてください。Markuplint v5 の間は旧名も動きますが、非推奨の警告が出ます。旧名は Markuplint の次のメジャーバージョン（Markuplint v6）で削除されます。

| 旧ルール名            | 新ルール名                                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `character-reference` | `no-unescaped-char`、`no-malformed-character-reference`                                                           |
| `required-attr`       | `require-attr`                                                                                                    |
| `invalid-attr`        | `no-unknown-attr`、`no-disallowed-attr`、`no-invalid-attr-value`、`no-restricted-attr`（`disallowAttrs`の移行先） |
| `disallowed-element`  | `no-restricted-element`                                                                                           |

ほかの改名は[上流の対応表](https://markuplint.dev/docs/migration/v4-to-v5/rules/rule-names)を参照してください。

## TypeScript

このリポジトリは TypeScript 6 系を使用しています。`@d-zero/markuplint-config/jsx`が使う`@markuplint/jsx-parser`が TypeScript 6 以下（`>=4.8.4 <6.1.0`）を必要とし、TypeScript 7 では読み込めないためです。

TypeScript 7 のプロジェクトで`@d-zero/markuplint-config/jsx`を使う場合は、[README の手順](./packages/@d-zero/markuplint-config/README.md#jsx--react)で TypeScript 6 を補ってください。
