---
name: npm-publish
description: npm パッケージのリリース（v5 / v6 ブランチでのバージョニング、タグ push、publish workflow 監視、publish 結果検証）
when_to_use: ユーザーが「リリースして」「publish して」「バージョン上げて」「/npm-publish」と指示した場合
disable-model-invocation: true
---

# 前提

- リリースは**リリースラインのブランチ**から行う。正式版（`latest`）は `v5`、次メジャーのプレリリース（`alpha`）は `v6`。`dev` はデフォルトブランチだが publish workflow を持たず、`package.json` の `yarn release` 系も旧運用（`lerna publish`）のままなので、**`dev` からはリリースしない**。`main` は実運用されていない（ルート `CLAUDE.md` の「ブランチ構成」）
- `yarn release`（`lerna version --no-push`）がバージョン決定・`package.json` 更新・リリースコミット・タグ作成までを行う。コミットとタグを push すると、タグ（`v*`）の push で `.github/workflows/publish.yml` が発火し、`lerna publish from-git` が npm へ publish する（OIDC Trusted Publishing、provenance 付き）
- **publish は取り消せない**。各ステップでユーザーの確認を取る
- **`yarn release` と `git push` 系はユーザーが実行する**。エージェントは実行せず（`.claude/settings.json` で deny されている）`!` プレフィックス付きのコマンドを提示し、完了報告を待つ

# 対象パッケージ

fixed モードのため全パッケージが同一バージョンで上がる（リリースラインの `lerna.json` の `version`）。`lerna version` は前回タグ以降に変更のあったパッケージだけを上げるので、変更の無いパッケージは前のバージョンのまま残る（例: `@d-zero/eslint-config` は 5.1.0 で上がらず 5.0.0 が `latest`）:

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

## 1. リリースラインの決定

ユーザーの指示からリリースラインを決める。正式版なら `v5`、v6 のプレリリースなら `v6`。指示から決まらなければ聞く（種別: spec silent）。以下 `<line>` と書く。

## 2. ワーキングツリーの状態確認

`git status` で未コミットの変更・未追跡ファイルがないか確認する。

- クリーンなら次へ
- 変更があればユーザーに報告し、`git stash` / コミット / 中断のいずれかを尋ねる。指示に従ってから次へ

汚れたまま先に進むとバージョニングが意図しない差分を巻き込むため、ここは省略しない。

## 3. リリースラインの最新化

```bash
git fetch origin
git switch <line>
git pull origin <line>
```

`pull` がコンフリクトやリジェクトで失敗したらユーザーに報告して指示を仰ぐ。

## 4. dev から取り込む変更の確認

`dev` の変更は自動では `<line>` に入らない。`dev` にあって `<line>` に無いコミットを提示する。

```bash
git log --oneline <line>..origin/dev
```

取り込むかどうか、どれを取り込むかはユーザーが決める（種別: scope）。`v6` は `dev` をマージで取り込む運用。`v5` に取り込むときは、`dev` の CLAUDE.md・skills の記述（リリースはリリースラインから）と `v5` 側の記述が衝突しうるので、コンフリクトはユーザーに報告して指示を仰ぐ。取り込みは PR 経由（`/pr` の手順、base `<line>`）にする。リリースラインに直接コミットしない。

## 5. 未マージ PR の確認

リリースに含めるべき PR が残っていないか確認し、あればユーザーに提示して続行可否を尋ねる。

```bash
gh pr list --base <line> --state open
```

## 6. lockfile の同期確認

```bash
yarn install
git diff yarn.lock
```

差分が出たらユーザーに報告する。publish workflow の `yarn install --immutable` が失敗するのを防ぐため必須。

あわせて、公開する各パッケージの `package.json` が固定している社外パッケージの版が、公開から 7 日以上たっているかを確認する。利用側は `npmMinimalAgeGate: 7d` を持つため、7 日未満の版を固定して公開すると、利用側は固定先が 7 日を過ぎるまでその版を `yarn install` できない。

```bash
npm view <pkg> time --json
```

7 日未満の版があれば止めてユーザーに提示する。7 日以上たった版に戻すか、ゲートを通過するまでリリースを待つ。

## 7. 事前チェック

```bash
yarn lint
yarn build
yarn test
```

すべてパスすること。失敗があれば修正してから次へ。`v5` 向けの PR には CI が付かない（`test.yml` の対象外）ので、ここでの結果がそのまま品質の判定になる。

## 8. リリース内容の提示

現在のバージョンと前回タグからの差分をユーザーに提示する。

```bash
git describe --tags --abbrev=0
git log --oneline $(git describe --tags --abbrev=0)..HEAD
```

`<line>` の `lerna.json` の `version` が現行バージョンの正。`yarn release` は conventional commits からバージョンを自動決定するため、**リリース種別をユーザーに確認する必要はない**。差分は「何が入るか」の確認材料として提示するだけでよい。

あわせて、前回タグ以降に破壊的変更マーカーが無いかを確認する。`v5` は安定版（`5.x.y`）なので、マーカー付きコミットが 1 つでもあれば `yarn release` が全パッケージのメジャー（6.0.0）を切ってしまう。`v6` の `6.0.0-alpha.n` ではプレリリース番号が進むだけ（段階ごとの効果と、付けてよい条件は `git` スキルの「破壊的変更と振る舞いの変更」）。

```bash
git log <last-tag>..HEAD --format=%s | grep -E '^[a-z]+(\([^)]*\))?!:'
git log <last-tag>..HEAD --format=%B | grep -iE '^(\* +)?BREAKING[ -]CHANGE:'
```

`v5` でヒットがあれば止めて提示する。ユーザーがメジャーを承認していた変更ならそのまま進む。承認の無いマーカー（誤って付いたもの、`dev` から取り込んだ v6 向けの変更など）でそれでもリリースするなら、バンプを明示して回避する: `yarn release minor`（または `patch`）。`lerna version` は `--conventional-commits` の推奨より位置引数のバンプを優先し、CHANGELOG は生成する。その CHANGELOG にはコミットの注記から「BREAKING CHANGES」節が入るので、マイナーリリースが破壊的変更を告知する形になる。選択肢を提示するときにそう言う。

振る舞いの変更の段落も集めて、リリース内容の一部として提示する。共有設定のルール追加・厳格化は利用側の lint を落とすので、ここで利用側への影響をユーザーと確認する。

```bash
git log <last-tag>..HEAD --grep='^Behavior change'
```

## 9. バージョニングと push（ユーザー実行）

`lerna version` は選択・確認のプロンプトを出すインタラクティブコマンドで、Claude Code の `!` 経由では対話できない（プロンプトが表示されても入力できず止まる）。ユーザーに次の手順を依頼する:

1. Claude Code のセッションを終了する（`exit`）
2. ターミナルで `<line>` にいることを確認し、直接 `yarn release`（`v6` のプレリリースなら `yarn release:alpha`）を実行してプロンプトに対話的に回答する
3. 完了したら `claude --continue` で会話に戻る

```
yarn release          # v5: 正式リリース
yarn release:alpha    # v6: alpha プレリリース
```

beta / rc（`yarn release:beta` / `yarn release:rc`）は、ユーザーが明示的に指示したときだけ案内する。

スクリプトは `--no-push` なので、**コミットとタグの push が別途必要**。ユーザーから完了報告を受けたら、次を提示する。

```
! git push origin <line> --follow-tags
```

実際にタグが push されたことを確認してから次へ進む。

```bash
git ls-remote --tags origin
```

## 10. publish workflow の監視

`v*` タグの push で `publish.yml` が発火する。バックグラウンド実行で完了を待つ。

```bash
gh run watch --exit-status
```

失敗したらログ URL をユーザーに提示し、「失敗時の対処」へ。

## 11. publish 結果の検証

workflow が success でも publish が意図通りとは限らない。**バージョンが上がったパッケージすべてについて**実際の npm 上の状態を確認する。

```bash
npm view <package> version
npm view <package> dist-tags
npm view <package> --json
```

確認項目:

- バージョンが手順 9 で上げた値と一致しているか
- **dist-tag が意図通りか**。`publish.yml` はタグ名から判定する（`-alpha` → `alpha`、`-beta` → `beta`、`-rc` → `rc`、それ以外で `-` を含む → `next`、それ以外 → `latest`）
- provenance が付与されているか（`npm view <package> --json` の `dist.attestations`）

fixed モードでも一部パッケージだけ publish に失敗する（部分 publish）ことがある。全対象パッケージを個別に確認し、漏れがあればユーザーに報告する。

**ここが success の判定点**。npm 上の状態を確認するまでリリース完了と判断してはいけない。

# 失敗時の対処

- **sigstore の transient 409 や一時的な失敗**: `gh run rerun --failed` で再実行する。`lerna publish from-git` は未 publish のバージョンのみを対象にするため、成功済みパッケージは二重 publish されない
- **部分 publish**: 成功したパッケージは publish 済みで巻き戻せない。上と同じく workflow の再実行で未 publish のパッケージだけが対象になる
- **誤ったバージョンを publish した**: unpublish は原則不可。`npm deprecate <package>@<version> "<理由>"` で非推奨化し、修正版を新バージョンとして publish する。この判断は必ずユーザーに確認を取る

# 注意

- **`v*` タグの作成・削除は CODEOWNERS のみ**（GitHub Rulesets で保護）。権限がない場合は手順 9 の push で失敗するため、実行者がタグ権限者か事前に確認する
- **publish は取り消せない**。手順 6・7 の事前チェックを省略しない
- **`.yarnrc.yml` の `npmMinimalAgeGate` を一時的に外していないか確認する**。自社パッケージの取り込みのために外したまま publish すると、保護が外れた状態がリリースに固定される
