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
- `yarn release`/`yarn release:alpha`/`yarn release:beta`/`yarn release:rc` — `lerna version`（push なし）。リリース手順は`.claude/skills/npm-publish/SKILL.md`参照
- `yarn commit`/`yarn co` — Commitizen 経由のコミット作成

### コマンド制約

- **yarn のみ使用**: npm/pnpm/bun/deno によるコマンド実行は禁止
- **パッケージディレクトリに cd しない**: 常にリポジトリルートから実行
- **ビルドは`yarn build`のみ**: `npx tsc`、`lerna run build --scope`等の個別指定は禁止
- **コマンドの連続実行禁止**: `&&`、`;`、改行によるコマンド連結をしない。1回の Bash 呼び出しで1コマンドのみ実行する。連結されたコマンドは settings.json の permissions allow/deny でパターンマッチできず、毎回ユーザーの手動承認が必要になり効率が大幅に低下する
- **main / dev ブランチでの作業・コミット禁止**: 作業開始前に`git branch --show-current`で現ブランチを確認し、`main`/`dev`にいる場合は`git switch -c <topic>`でトピックブランチを作ってから作業する。これらのブランチでの直接コミットはリポジトリのルールで禁止されている

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
- 実装計画由来の相対概念（Phase/Step 番号、「本 PR」「今回」「旧実装」「導入予定」）を JSDoc・テスト名・ドキュメントに書かない。外部参照は issue/PR 番号のみ可

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

| スキル          | パス                                      | 用途                                                    |
| --------------- | ----------------------------------------- | ------------------------------------------------------- |
| git             | `.claude/skills/git/SKILL.md`             | コミット作成・メッセージ形式・事前チェック              |
| pr              | `.claude/skills/pr/SKILL.md`              | プルリクエストの作成とプッシュ                          |
| grill-me        | `.claude/skills/grill-me/SKILL.md`        | 計画・設計の合意形成                                    |
| impl            | `.claude/skills/impl/SKILL.md`            | 合意済み計画の実装〜PR作成オーケストレーション          |
| npm-publish     | `.claude/skills/npm-publish/SKILL.md`     | npm パッケージのリリース                                |
| product-manager | `.claude/skills/product-manager/SKILL.md` | リポジトリ分析、ドキュメント生成・レビュー、PR レビュー |
| qa-engineer     | `.claude/skills/qa-engineer/SKILL.md`     | コードレビュー、テスト品質チェック、カバレッジ改善      |

## 注意

- `main`ブランチは現時点で実運用されていない（古いバージョンのまま残置）。リリースは`dev`ブランチから行う（詳細は`.claude/skills/npm-publish/SKILL.md`）
