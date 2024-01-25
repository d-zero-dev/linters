# ディーゼロ 開発環境 リンター&amp;フォーマッター

## パッケージ

### メインパッケージ

- [`@d-zero/linters`](./packages/%40d-zero/linters/)

### サブパッケージ

| パッケージ名                                                             | 内容                                                                 |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| [`@d-zero/cspell-config`](./packages/%40d-zero/cspell-config/)           | [_CSpell_](https://cspell.org/)の設定ファイル                        |
| [`@d-zero/eslint-config`](./packages/%40d-zero/eslint-config/)           | [_ESLint_](https://eslint.org/)の設定ファイル                        |
| [`@d-zero/lint-staged-config`](./packages/%40d-zero/lint-staged-config/) | [_lint-staged_](https://github.com/okonet/lint-staged)の設定ファイル |
| [`@d-zero/markuplint-config`](./packages/%40d-zero/markuplint-config/)   | [_Markuplint_](https://markuplint.dev/)の設定ファイル                |
| [`@d-zero/prettier-config`](./packages/%40d-zero/prettier-config/)       | [_Prettier_](https://prettier.io/)の設定ファイル                     |
| [`@d-zero/pug-lint-config`](./packages/%40d-zero/pug-lint-config/)       | [_pug-lint_](https://github.com/pugjs/pug-lint)の設定ファイル        |
| [`@d-zero/stylelint-config`](./packages/%40d-zero/stylelint-config/)     | [_Stylelint_](https://stylelint.io/)の設定ファイル                   |
| [`@d-zero/textlint-config`](./packages/%40d-zero/textlint-config/)       | [_textlint_](https://textlint.github.io/)の設定ファイル              |

---

## メンテナンス環境

このリポジトリ自体の開発およびメンテナンスに必要なツールは次のとおりです。

- **Node.js** v20最新
- **yarn** (*Node.js*付属もしくは*npm*よりグローバルインストール)
- [**actionlint**](https://github.com/rhysd/actionlint)

### メンテ用コマンド

| コマンド    | 内容                             |
| ----------- | -------------------------------- |
| `yarn lint` | リント（各種リントを実行します） |
| `yarn test` | テスト（*Vitest*を実行します）   |

---

## GitHub Actions

### [Test](https://github.com/d-zero-dev/linters/actions/workflows/test.yml)

---

## Dependabot

依存パッケージの脆弱性を検知する機能を導入しています。

[Dependabot alerts](https://github.com/d-zero-dev/linters/security/dependabot)の一覧から対象のパッケージと深刻度を確認します。

脆弱性のあるパッケージが、どのパッケージに依存しているかは次のコマンドで発見できます。

```shell
yarn why <package_name>
```

依存関係を確認後、対応方法を検討し、必要があれば対象のパッケージをアップデートしてください。

もしくは、次のことに関係ある場合「**Dismiss alert**」から該当のものを選択して解決としてください。

- A fix has already been started (既に修正しようとしている)
- No bandwidth to fix this (修正の余裕なし)
- Risk is tolerable to this project (リスクが許容範囲)
- This alert is inaccurate or incorrect (不正確なアラート)
- Vulnerable code is not actually used (脆弱のあるコードが実際に使用されることはない)
