# `@d-zero/markuplint-config`

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
