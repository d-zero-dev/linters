# `@d-zero/markuplint-config`

D-ZERO用のMarkuplint設定です。アクセシブルで保守性の高いHTML実装を促進するためのルールセットを提供します。

## 個別インストール

```sh
npm install -D @d-zero/markuplint-config
```

Node.js 24 以上が必要です（Markuplint v5 の要件）。

PugやJSXのパーサーは任意の依存（optional peerDependencies）です。使う場合だけ、後述の手順で追加してください。HTMLだけのプロジェクトにTypeScript関連の依存を入れないためです。

## 使い方

`.markuplintrc`を作成し、[`extends`](https://markuplint.dev/ja/docs/configuration/properties#extends)機能を使って読み込みます。

```json
{
	"extends": ["@d-zero/markuplint-config"]
}
```

Markuplint v4 からの変更は[Markuplint の移行ガイド](https://markuplint.dev/docs/migration/v4-to-v5)と、このリポジトリの[MIGRATION-v6.md](../../../MIGRATION-v6.md#markuplint-v5)を参照してください。

- Markuplint v5 のCLIは警告（`warning`）があっても終了コード0で終わります。CIで警告も失敗にする場合は`--no-allow-warnings`を付けてください。`require-h1`など、v5で`error`から`warning`に変わったルールがあります（[一覧](https://markuplint.dev/docs/migration/v4-to-v5/rules/rule-names#severity-changes)）
- `markuplint -c <file>`は指定したファイルだけを読み、`.markuplintrc`を合わせて読みません

### 含まれるプリセット

- `markuplint:recommended-static-html`
- `markuplint:compat`: 対象ブラウザーが対応していない機能（`no-unsupported-browser-features`）と非標準の機能（`no-nonstandard-features`）を警告します。対象ブラウザーはプロジェクトのbrowserslistの設定から決まり、設定が無ければ`no-unsupported-browser-features`は何も検査しません。D-ZERO独自ルールが必須にする`button`要素の`command`/`commandfor`属性は、対象ブラウザーにかかわらず報告しません
- Markuplint v5 のプリセットから外れた`no-ineffective-attr`と`no-duplicate-dt`も引き続き有効です

`markuplint:compat`の警告は、対象ブラウザーで使えない機能を使っていることを示します。`--no-allow-warnings`（`@d-zero/lint-staged-config`の既定）ではコミットが止まります。対象ブラウザーを見直すか、プロジェクトとして許容する機能を`ignoreFeatures`に追加してください。既定の除外を残すため、既定の値も含めて指定します。

```json
{
	"extends": ["@d-zero/markuplint-config"],
	"rules": {
		"no-unsupported-browser-features": {
			"options": {
				"ignoreFeatures": ["button[command]", "button[commandfor]", "dialog"]
			}
		}
	}
}
```

### Pug

`.pug`を検査する場合は`@markuplint/pug-parser`を追加し、`@d-zero/markuplint-config/pug`をextendsします。追加しないと`.pug`はエラーにならず黙って飛ばされます。

```sh
npm install -D @markuplint/pug-parser
```

```json
{
	"extends": ["@d-zero/markuplint-config", "@d-zero/markuplint-config/pug"]
}
```

Pugへの対応はv7で廃止する予定です（[MIGRATION-v6.md](../../../MIGRATION-v6.md#formatter)）。

### JSX / React

`.jsx`/`.tsx`を検査する場合は`@markuplint/jsx-parser`と`@markuplint/react-spec`を追加し、`@d-zero/markuplint-config/jsx`をextendsします。JSXパーサーとReactの仕様（`className`を`class`として扱うなど）が有効になり、`id`属性のハードコードを警告します。

```sh
npm install -D @markuplint/jsx-parser @markuplint/react-spec
```

```json
{
	"extends": ["@d-zero/markuplint-config", "@d-zero/markuplint-config/jsx"]
}
```

> [!WARNING]
> `@markuplint/jsx-parser`は内部で使う`@typescript-eslint/typescript-estree`のためにTypeScript `>=4.8.4 <6.1.0`を必要としますが、`typescript`を依存として宣言していません。プロジェクトのTypeScriptがこの範囲ならそのまま動きます。範囲外の場合は読み込みに失敗します（7以上では`Cannot read properties of undefined (reading 'Cjs')`）。
>
> - TypeScriptが無いプロジェクト: `typescript@6.0.3`をdevDependenciesに追加してください
> - TypeScript 7以上のプロジェクト: YarnとpnpmではpackageExtensionsでjsx-parserにTypeScript 6を補ってください。npmには同等の機能がありません
>
> ```yaml
> # .yarnrc.yml（pnpmでは pnpm-workspace.yaml の packageExtensions）
> packageExtensions:
>   '@markuplint/jsx-parser@*':
>     dependencies:
>       typescript: '6.0.3'
> ```

`.js`/`.ts`はJSXとして扱いません。JSXは`.jsx`/`.tsx`に書いてください。

> [!NOTE]
> Pugの文字参照の検査の無効化と、JSXの`id`属性のハードコードの警告は、Markuplintを実行したディレクトリの配下にあるファイルにだけ適用されます。Markuplintの設定は自身のディレクトリを基準にパスを解決するため、`node_modules`内の設定からは実行ディレクトリを基準にしています。Markuplintはプロジェクトのルートで実行してください。

## 含まれるルール

### D-ZERO独自ルール

D-ZERO独自のルールは`d-zero/`で始まる名前付きルールです。違反の出力にもこの名前が表示されます。

| 名前                                         | 内容                                                                                                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `d-zero/img-require-alt`                     | `img`要素の`alt`属性必須                                                                                                                                |
| `d-zero/img-src-naming`                      | 画像ファイル名（`img`要素の`src`属性）は小文字のケバブケース。大文字、スペース、アンダースコアは使用不可。`data:`/`blob:`/外部URLは対象外               |
| `d-zero/media-src-naming`                    | `video`/`audio`/`source`要素の`src`/`poster`属性のファイル名は小文字のケバブケース                                                                      |
| `d-zero/a-require-href`                      | `a`要素の`href`属性必須                                                                                                                                 |
| `d-zero/a-no-javascript-href`                | `a`要素の`href`属性で`javascript:`スキームを禁止。代わりに`button`要素を使う                                                                            |
| `d-zero/button-require-command`              | `type="button"`のbutton要素は`command`属性必須（Invoker Commands API）。`role`属性を持つボタン、`type="submit"`/`type="reset"`/typeなしのボタンは対象外 |
| `d-zero/button-require-commandfor`           | `popovertarget`属性を持つボタンは`commandfor`属性必須（`popovertarget`は将来的に非推奨となる予定）                                                      |
| `d-zero/popovertargetaction-require-command` | `popovertargetaction`属性を持つボタンは`command`属性（`show-popover`/`hide-popover`/`toggle-popover`）必須                                              |

Invoker Commands APIを使う理由は[`@d-zero/oxlint-plugin`の`@d-zero/no-click-event`](../oxlint-plugin/README.md#d-zerono-click-event)を参照してください。

### その他の設定

- **`br`要素の禁止**（`no-restricted-element`）: CSSでスタイルを調整します
- **`html`要素の`prefix`属性の許可**: Open Graph Protocolのため
- **`img`要素の`width`/`height`属性は省略可能**: ビルド時に自動的に付与されるため（`performance/img-aspect-ratio`を無効化）
- **`https://`で始まる外部スクリプトは`require-attr`の対象外**

## 拡張

プロジェクトに合わせて設定を追加します。

```json
{
	"extends": ["@d-zero/markuplint-config"],
	"rules": {
		// 例: クラス名の命名規則を変更する
		"class-naming": {
			"value": "/^(?<Prefix>[lpc])-(?<ComponentName>[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/"
		}
	}
}
```

### D-ZERO独自ルールの無効化

`rules`で名前を指定してプロジェクト全体で無効化できます。

```json
{
	"extends": ["@d-zero/markuplint-config"],
	"rules": {
		"d-zero/button-require-command": false
	}
}
```

特定の要素だけで無効化する場合は、名前を付けない`nodeRules`でベースルールを無効化します（Markuplintにはインラインの無効化コメントがありません）。ベースルールの設定は、同じベースルールを使う名前付きルールにも伝わります。

```json
{
	"extends": ["@d-zero/markuplint-config"],
	"nodeRules": [
		{
			"selector": ".c-dummy-link",
			"rules": {
				"require-attr": false
			}
		}
	]
}
```

`nodeRules`に`d-zero/`で始まる名前を付けないでください。同じ名前の名前付きルールを置き換え、そのD-ZERO独自ルールがすべての要素で動かなくなります。

### クラスの命名規則の追加

`class-naming`の設定を変更する場合、上書きがやや冗長になるので、専用の関数を使って許可するクラスを追加します。

```js
import { extendsConfig } from '@d-zero/markuplint-config';

export default extendsConfig({
	// 通常のクラス命名規則に加えて、Splideのクラス名も許可する
	classNaming: ['/^splide(?:__[a-z]+)?$/'],
});

// または、以下のように書くこともできます

const config = extendsConfig({
	// 通常のクラス命名規則に加えて、Splideのクラス名も許可する
	classNaming: ['/^splide(?:__[a-z]+)?$/'],
});

export default {
	...config,
	// 他の設定。`rules`はそのまま書くと既定のルールを置き換えるため、展開してから追加する
	rules: {
		...config.rules,
		'no-unescaped-char': false,
	},
};
```

`extendsConfig`とPug/JSXの設定を組み合わせる場合は、`extends`を上書きせずに連結します。上書きすると`extendsConfig`が含むMarkuplintのプリセットが外れます。

```js
import { extendsConfig } from '@d-zero/markuplint-config';

const config = extendsConfig({
	classNaming: ['/^splide(?:__[a-z]+)?$/'],
});

export default {
	...config,
	extends: [...config.extends, '@d-zero/markuplint-config/pug'],
};
```
