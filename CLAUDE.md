# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

D-ZERO 株式会社の Lint/Formatter 設定パッケージ群を管理する Lerna + Yarn Workspaces のモノレポ。`@d-zero/`スコープ配下に各種 lint ツールの共有設定とカスタムプラグインを配置し、npm に publish する（fixed バージョンモード）。

## プロジェクト構成

作業前に以下のファイルを確認し、プロジェクトの状態を把握すること:

- `package.json` — scripts、devDependencies、Volta（Node/Yarn バージョン）
- `lerna.json` — fixed バージョンモード、`packages/@d-zero/*`
- `README.md` — 各パッケージの役割一覧
- `tsconfig.json` — TypeScript 設定（`@d-zero/tsconfig`を継承）
- `eslint.config.js` — ルートの ESLint 設定
- `cspell.json` — スペルチェック辞書
- `.github/renovate.json` — 依存更新設定

各パッケージの構成・依存関係は`packages/@d-zero/*/package.json`を参照すること。

## コマンド

- `yarn build` — 全パッケージビルド（`lerna run build`）
- `yarn test` — Vitest によるテスト実行
- `yarn lint` — tsc/eslint/prettier/textlint/cspell/secretlint/actionlint を直列実行
- `yarn lint:ci` — CI 用（actionlint を除く）
- `yarn release`系 — `lerna version --no-push`。リリースラインの`v5`/`v6`でだけ実行し、`dev`では実行しない。手順は`.claude/skills/npm-publish/SKILL.md`参照
- `yarn commit`/`yarn co` — Commitizen 経由のコミット作成

### コマンド制約

- **yarn のみ使用**: npm/pnpm/bun/deno によるコマンド実行は禁止
- **パッケージディレクトリに cd しない**: 常にリポジトリルートから実行
- **ビルドは`yarn build`のみ**: `npx tsc`、`lerna run build --scope`等の個別指定は禁止
- **コマンドの連続実行禁止**: `&&`、`;`、改行によるコマンド連結をしない。1回の Bash 呼び出しで1コマンドのみ実行する。連結されたコマンドは settings.json の permissions allow/deny でパターンマッチできず、毎回ユーザーの手動承認が必要になり効率が大幅に低下する
- **main / dev / v5 / v6 ブランチでの作業・コミット禁止**: 作業開始前に`git branch --show-current`で現ブランチを確認し、これらのブランチにいる場合は`git switch -c <topic>`でトピックブランチを作ってから作業する（リリースラインでの`dev`の取り込みマージとリリースコミットを除く。`.claude/skills/npm-publish/SKILL.md`）

## ブランチ構成

| ブランチ | 役割                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------ |
| `dev`    | デフォルトブランチ。Renovate の更新と通常の PR が入る。ここからはリリースしない                  |
| `v5`     | 現行メジャー（v5）のリリースライン。`latest` dist-tag はここから出る                             |
| `v6`     | 次メジャー（v6）の開発・リリースライン。`alpha` dist-tag はここから出る。`dev`と`v5`を取り込む   |
| `main`   | 現行メジャーの最新リリースを指す。`v5`のリリース後に`v5`へ fast-forward する。直接コミットしない |

- リリースは`v5`/`v6`で`yarn release`（`lerna version --no-push`）→ コミットとタグを push → タグ（`v*`）の push で`.github/workflows/publish.yml`が`lerna publish from-git`を OIDC Trusted Publishing（provenance 付き）で実行する
- `dev`の変更は自動では`v5`に入らない。`dev`にマージした修正を現行メジャーで出すには、`dev`を`v5`にローカルでマージしてからリリースする。何を取り込むかはユーザーが決める
- `v5`のリリース後は、`v5`を`dev`と`main`に取り込む。`dev`へは`dev`から切ったトピックブランチに`v5`をマージして PR にする（`v5`を head にした PR は、ブランチの更新で未リリースの`dev`の変更を`v5`に入れてしまう）。`main`は`v5`への fast-forward。これで`dev`のバージョン・CHANGELOG・リリース用の設定が`v5`とずれない
- `v6`は`dev`と`v5`をマージで取り込む（`v6`を`dev`/`v5`/`main`にマージしない）
- `Fixes #N`が issue を閉じるのはデフォルトブランチ（`dev`）へのマージだけ。`v5`/`v6`への PR では`merged`スキルが手で閉じる
- `dev`の CI（`test.yml`）は`main`/`dev`向けの PR にしか起動しない。`v5`向けの PR には CI が付かない（`v6`は`v*`向け PR でも起動する）

## パッケージ依存関係

カスタムルール／プラグインが対応する設定パッケージから参照される構造:

- `@d-zero/csstree-scss-syntax` ← `@d-zero/stylelint-rules` ← `@d-zero/stylelint-config`
- `@d-zero/eslint-plugin` ← `@d-zero/eslint-config`
- `@d-zero/cz-config` ← `@d-zero/commitlint-config`

その他の`*-config`パッケージ（`cspell-config`, `lint-staged-config`, `markuplint-config`, `prettier-config`, `pug-lint-config`, `textlint-config`）は独立しており、相互依存はない。コミット順序は`.claude/skills/git/SKILL.md`のティア表を参照。

## 依存関係の追加

- バージョンは固定で追加する（`yarn add foo@1.2.3`）。`^`/`~`を付けない
- **追加したら`.github/renovate.json`の`packageRules`を確認する**。そのパッケージが既存の`groupName`グループに入るべきか、新しいグループを作るべきかを判断する
  - `config:recommended`は`group:monorepos`を含むため、**同一 monorepo から公開されるパッケージ群は設定なしで自動的に束ねられる**。手で書く必要はない
  - 手当てが必要なのは Renovate が推測できない**ベンダー横断の結合**（本体と型定義のペア、peer dependency で結ばれた別ベンダーのパッケージ、自前の`@d-zero/*`パッケージ群など）
  - 判断基準は「**片方だけバージョンが上がった状態でビルドと型チェックが通るか**」。通らないなら同じ`groupName`にまとめる
- グループ化を怠ると、Renovate が個別に PR を作り、片方だけマージされた中間状態で CI が赤になる。結果として**両方の PR がマージできなくなる**
- グルーピングの現状は`git branch -r --list 'origin/renovate/*'`で確認できる。`*-monorepo`サフィックスのブランチは`group:monorepos`による自動グループ

## ドキュメント原則

- コードには How、テストコードには What、コミットログには Why、コードコメントには Why not（必要なら Why も）を書く
- JSDoc は公開 API の API ユーザー向け文書（WHAT/HOW/WHY + `@example`必須）。非公開 API は必須にしない
- 実装計画由来の相対概念（Phase/Step 番号、「本 PR」「今回」「旧実装」「導入予定」）を JSDoc・テスト名・ドキュメントに書かない。コードコメント・JSDoc・テスト名に issue/PR 番号も書かず、理由そのものを書く（例外は PR 本文とコミットメッセージ）

## 判断基準

- **変更・修正・レビュー指摘を採用するかは 2 つで決める**: 共有設定・カスタムルールとして、利用側リポジトリで D-Zero のフロントエンドガイドライン（`d-zero-dev/frontend-guidelines`）どおりの lint/format 結果になること（誤検知と見逃しがなく、利用側の lint・ビルドが通る）。製品の振る舞いでない変更（tooling・docs・CI・skills）では「宣言した意図に対する正しさ」と「既存コードとの一貫性」。実装コスト、diff の大きさ、影響件数、「軽微」は基準ではなく、スキップ・先送り・質問の理由にならない
- **基準が決めることは聞かずにやる**。質問は、基準が決めないことと、リポジトリ外への書き込みのためにある（質問の種別は`impl`スキルが定める）。Claude は「持ち越す」「スキップする」「そのままにする」を自分で決めない。それらは質問に対するユーザーの回答としてだけ存在し、「あとで」「別 PR で」「意図的に変更しない」と書く応答・PR 本文・コミットは、その質問と回答を指せなければならない
- **レビュー指摘は直すか、証拠を添えてユーザーに出す**。「false positive」「元からあった」「意図どおり」はユーザーに対して主張することであって、Claude が 1 人で指摘を閉じる手段ではない

## セキュリティ

### 機密情報の取り扱い

- `.env`、`.env.*`等の機密ファイルを読み取り・編集・コミットしない（機密ファイルの判断は`.gitignore`を参考にすること）
- コミット前に`git diff --staged`で機密情報（API キー、トークン、パスワード、企業名、顧客情報）が含まれていないか確認する
- **サンプル値は予約済み慣例に従う**: ドメインは`example.com`/`*.example`/`*.test`等（RFC 2606/6761）、IP は TEST-NET。実在の無関係ドメイン、未取得の創作ドメイン、案件識別子、実データ・実コーパスの断片を成果物に残さない（詳細は`.claude/skills/git/SKILL.md`のサンプル値慣例チェック）
- 環境変数やシークレットをコード内にハードコードしない

### サプライチェーン保護

- **yarn dlx は完全禁止**: ローカルパッケージを使わずリモートから直接実行するため、サプライチェーン攻撃に脆弱
- **npx は原則使わない**: package.json の scripts で定義されたコマンドを`yarn <script>`で実行すること
- 新しい依存パッケージの追加は慎重に。既存の依存で解決できないか先に確認する
- `yarn add`する前にパッケージの信頼性（ダウンロード数、メンテナンス状況、既知の脆弱性）を確認する
- `yarn add`する場合はバージョンを固定する（例: `yarn add foo@1.2.3`）
- lockfile（yarn.lock）の手動編集は禁止

## スキル

タスクに応じて`.claude/skills/`配下のスキルを参照すること。

| スキル          | パス                                      | 用途                                                                       |
| --------------- | ----------------------------------------- | -------------------------------------------------------------------------- |
| git             | `.claude/skills/git/SKILL.md`             | コミット作成・メッセージ形式・事前チェック・破壊的変更の扱い               |
| pr              | `.claude/skills/pr/SKILL.md`              | プルリクエストの作成とプッシュ（本文の節構成、CI 監視）                    |
| merged          | `.claude/skills/merged/SKILL.md`          | マージ後の手順（外部作者への完了コメント、issue への報告）                 |
| create-issue    | `.claude/skills/create-issue/SKILL.md`    | 原因まで調べて Issue を起票する（持ち越しの引き継ぎ先）                    |
| grill-me        | `.claude/skills/grill-me/SKILL.md`        | 計画・設計の合意形成                                                       |
| impl            | `.claude/skills/impl/SKILL.md`            | 合意済み計画の実装・検証・持ち越しの Issue 化・PR 作成・マージ後の台帳確認 |
| npm-publish     | `.claude/skills/npm-publish/SKILL.md`     | npm パッケージのリリース                                                   |
| product-manager | `.claude/skills/product-manager/SKILL.md` | リポジトリ分析、ドキュメント生成・レビュー、PR レビュー                    |
| qa-engineer     | `.claude/skills/qa-engineer/SKILL.md`     | コードレビュー、テスト品質チェック、カバレッジ改善                         |
