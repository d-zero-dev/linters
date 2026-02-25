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
		'character-reference': false,
	},
};
```
