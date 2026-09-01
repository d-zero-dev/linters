# `@d-zero/markuplint-config`

D-ZERO用のMarkuplint設定です。アクセシブルで保守性の高いHTML実装を促進するためのルールセットを提供します。

## 個別インストール

```sh
npm install -D @d-zero/markuplint-config
```

## 使い方

`.markuplintrc`を作成し、[`extends`](https://markuplint.dev/ja/docs/configuration/properties#extends)機能を使って読み込みます。

```json
{
	"extends": ["@d-zero/markuplint-config"]
}
```

## 含まれるルール

このconfigには以下のD-ZERO独自ルールが含まれています：

### 1. 要素の禁止・必須化

- **`br`要素の禁止**: CSSでスタイル調整を推奨
- **`img`要素のalt属性必須**: アクセシビリティ確保のため
- **`a`要素のhref属性必須**: リンクの明確化

### 2. button要素のInvoker Commands API使用の強制

- **`type="button"`のbutton要素**: `command`属性が必須
  - Invoker Commands APIを使用した宣言的なUI実装を推奨
  - 例外: `role`属性を持つボタン、フォーム送信ボタン（`type="submit"`/`type="reset"`/typeなし）

- **`popovertarget`属性を持つボタン**: Invoker Commands APIへの移行を推奨
  - `commandfor`/`command`属性の使用を推奨
  - `popovertarget`は将来的に非推奨となる予定

詳細は[CODING_GUIDELINES_NO_CLICK_EVENT.md](../../CODING_GUIDELINES_NO_CLICK_EVENT.md)を参照してください。

### 3. ファイル名の命名規則

- **画像/メディアファイル**: 小文字のケバブケース（ハイフン区切り）を強制
  - 対象: `img`, `video`, `audio`, `source`要素の`src`/`poster`属性
  - 大文字、スペース、アンダースコアは使用不可

### 4. 無効な属性

- **`a`要素のhref属性**: `javascript:`スキームを禁止
  - 代わりに`button`要素の使用を推奨

### 5. 特殊な属性の許可

- **`html`要素の`prefix`属性**: Open Graph Protocolのため許可

### 6. Markuplint標準ルールの追加有効化

recommendedプリセットに含まれない以下の標準ルールを有効化しています：

- **`attr-order`**: 属性順序を`id > class > role > aria-* > data-* > 要素固有属性`に統一
- **`no-boolean-attr-value`**: boolean属性の冗長な値を禁止（例: `disabled="disabled"`）
- **`no-default-value`**: デフォルト値と同一の属性値指定を禁止（例: `type="text"`）
- **`no-unsupported-browser-features`**: `browserslist`設定に基づくブラウザ未サポート要素・属性の検出（`browserslist`設定がないプロジェクトでは影響なし）
- **`performance/img-aspect-ratio`**: 無効化。`img[src]`の`width`/`height`必須ルールはビルド時に自動付与されるため不要

なお`head-element-order`（`<head>`内要素の順序）・`no-event-handler-attr`（インラインイベントハンドラ属性の禁止）は`markuplint:recommended-static-html`が拡張する`performance`/`security`プリセットで既定有効のため、このconfigでは重複指定していません。

### 拡張

プロジェクトに合わせて設定を追加します。

```json
{
	"extends": ["@d-zero/markuplint-config"],
	"rules": {
		// 例: クラス名の命名規則を変更する
		"class-naming": {
			"value": "/^c-(?<ComponentName>[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/"
		}
	}
}
```

`class-naming`の設定を変更する場合、上書きがやや冗長になるので、専用の関数を使って許可するクラスを追加します。

```js
import { extendsConfig } from '@d-zero/markuplint-config';

export default extendsConfig({
	// 通常のクラス命名規則に加えて、Splideのクラス名も許可する
	classNaming: ['/^splide(?:__[a-z]+)?$/'],
});

// または、以下のように書くこともできます

export default {
	...extendsConfig({
		// 通常のクラス命名規則に加えて、Splideのクラス名も許可する
		classNaming: ['/^splide(?:__[a-z]+)?$/'],
	}),
	// 他の設定
	rules: {
		'no-malformed-character-reference': false,
		'no-unescaped-char': false,
	},
};
```
