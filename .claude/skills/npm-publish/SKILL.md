---
name: npm-publish
description: npm パッケージのリリース（lerna publish によるバージョニング・タグ作成・npm publish 一括実行、publish 結果検証）
when_to_use: ユーザーが「リリースして」「publish して」「バージョン上げて」「/npm-publish」と指示した場合
disable-model-invocation: true
---

# 前提

- リリースは `dev` ブランチから行う。`main` ブランチはこのリポジトリでは実運用されていない（古いバージョンのまま残置されており、リリース対象ではない）
- `yarn release`（`lerna publish`）は、バージョンの決定・`package.json` 更新・コミット・git タグ作成・タグ push・npm publish を**一括で対話的に実行する**。タグ push を起点に発火する publish workflow は存在しない（OIDC Trusted Publishing 未導入）
- **publish は取り消せない**。各ステップでユーザーの確認を取る
- **`yarn release` はユーザーが実行する**。`lerna publish` は選択・確認のプロンプトを出すインタラクティブコマンドで、Claude Code の `!` 経由では対話できない（プロンプトが表示されても入力できず止まる）

# 対象パッケージ

fixed モードのため全パッケージが同一バージョンで上がる（`lerna.json` の `version`）:

| ディレクトリ                           | npm パッケージ名              |
| -------------------------------------- | ----------------------------- |
| `packages/@d-zero/commitlint-config`   | `@d-zero/commitlint-config`   |
| `packages/@d-zero/cspell-config`       | `@d-zero/cspell-config`       |
| `packages/@d-zero/csstree-scss-syntax` | `@d-zero/csstree-scss-syntax` |
| `packages/@d-zero/cz-config`           | `@d-zero/cz-config`           |
| `packages/@d-zero/eslint-config`       | `@d-zero/eslint-config`       |
| `packages/@d-zero/eslint-plugin`       | `@d-zero/eslint-plugin`       |
| `packages/@d-zero/lint-staged-config`  | `@d-zero/lint-staged-config`  |
| `packages/@d-zero/markuplint-config`   | `@d-zero/markuplint-config`   |
| `packages/@d-zero/prettier-config`     | `@d-zero/prettier-config`     |
| `packages/@d-zero/pug-lint-config`     | `@d-zero/pug-lint-config`     |
| `packages/@d-zero/stylelint-config`    | `@d-zero/stylelint-config`    |
| `packages/@d-zero/stylelint-rules`     | `@d-zero/stylelint-rules`     |
| `packages/@d-zero/textlint-config`     | `@d-zero/textlint-config`     |

# 手順

## 1. ワーキングツリーの状態確認

`git status` で未コミットの変更・未追跡ファイルがないか確認する。

- クリーンなら次へ
- 変更があればユーザーに報告し、`git stash` / コミット / 中断のいずれかを尋ねる。指示に従ってから次へ

汚れたまま先に進むとバージョニングが意図しない差分を巻き込むため、ここは省略しない。

## 2. dev の最新化

```bash
git fetch origin
git checkout dev
git pull origin dev
```

`pull` がコンフリクトやリジェクトで失敗したらユーザーに報告して指示を仰ぐ。

## 3. 未マージ PR の確認

リリースに含めるべき PR が残っていないか確認し、あればユーザーに提示して続行可否を尋ねる。

```bash
gh pr list --base dev --state open
```

## 4. 事前チェック

```bash
yarn lint
yarn build
yarn test
```

すべてパスすること。失敗があれば修正してから次へ。`yarn release` は build を再度走らせないため、ここで確実に検証しておく。

## 5. リリース内容の提示

現在のバージョンと前回タグからの差分をユーザーに提示する。

```bash
git describe --tags --abbrev=0
git log --oneline $(git describe --tags --abbrev=0)..HEAD
```

`yarn release` は conventional commits からバージョンを自動決定するため、**リリース種別をユーザーに確認する必要はない**。差分は「何が入るか」の確認材料として提示するだけでよい。

## 6. リリース実行（ユーザー実行）

ユーザーに次のコマンドを案内する。

```
yarn release          # graduate（正式リリース。通常はこれだけで十分）
```

alpha / next / canary のプレリリースが必要な場合は、ユーザーが会話の中で明示的に指示したときだけ案内する。

```
yarn release:alpha:latest   # alpha プレリリース（latest dist-tag）
yarn release:next           # alpha プレリリース（next dist-tag）
yarn release:canary         # canary プレリリース
```

`lerna publish` は対話プロンプトを出すため、ユーザーがターミナルで直接実行する。実行後、バージョン・コミット・タグ push・npm publish まで完了しているはず。

## 7. publish 結果の検証

workflow を介さず `lerna publish` プロセスの終了コードのみで完了報告されるため、**各パッケージについて**実際の npm 上の状態を確認する。

```bash
npm view <package> version
npm view <package> dist-tags
```

確認項目:

- バージョンが手順 6 で上げた値と一致しているか
- dist-tag が意図通りか（正式リリースは `latest`、プレリリースは `alpha` / `next` / `dev`(canary)）

fixed モードでも一部パッケージだけ publish に失敗する（部分 publish）ことがある。全対象パッケージを個別に確認し、漏れがあればユーザーに報告する。

**ここが success の判定点**。npm 上の状態を確認するまでリリース完了と判断してはいけない。

## 8. タグ push の確認

`lerna publish` は通常タグ push まで自動で行うが、念のため確認する。

```bash
git ls-remote --tags origin
```

取りこぼしがあれば `! git push --tags` をユーザーに依頼する。

# 失敗時の対処

- **部分 publish**: 成功したパッケージは publish 済みで巻き戻せない。`lerna publish from-package` を実行すると、未 publish のバージョンのみを対象に再試行できる（成功済みパッケージは二重 publish されない）
- **誤ったバージョンを publish した**: unpublish は原則不可。`npm deprecate <package>@<version> "<理由>"` で非推奨化し、修正版を新バージョンとして publish する。この判断は必ずユーザーに確認を取る

# 注意

- **publish は取り消せない**。手順 4 の事前チェックを省略しない
- 現状 OIDC Trusted Publishing・タグ push 起点の publish workflow は未導入。導入時はこのスキルの前提・手順 6〜8 を書き換える必要がある
