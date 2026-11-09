# `@d-zero/prettier-config`

## 個別インストール

```sh
npm install -D @d-zero/prettier-config @prettier/plugin-pug prettier-plugin-astro
```

`@d-zero/prettier-config/base`を利用する場合は、`@prettier/plugin-pug`と`prettier-plugin-astro`をインストールする必要はありません。

## 使い方

`.prettierrc.mjs`を作成し、設定を読み込みエクスポートします。

```js
import config from '@d-zero/prettier-config';
export default config;
```

### 拡張

プロジェクトに合わせて設定を追加します。

```js
import config from '@d-zero/prettier-config';
export default {
	...config,
	// 例: タブをスペースに変換しない
	useTabs: false,
};
```

## 種類別プリセット

| パッケージパス                  | 用途                               |
| ------------------------------- | ---------------------------------- |
| `@d-zero/prettier-config`       | フルセット（ベース + Pug + Astro） |
| `@d-zero/prettier-config/base`  | 基本セット（Pugなし）              |
| `@d-zero/prettier-config/astro` | Astro関連設定のみ                  |
| `@d-zero/prettier-config/pug`   | Pug関連設定のみ                    |

`@d-zero/prettier-config`はすべての設定を含んでいるので、一部の設定のみを利用する場合は、それぞれ種類別のものを利用します。

```js
import baseConfig from '@d-zero/prettier-config/base';
import pugConfig from '@d-zero/prettier-config/pug';

export default {
	...baseConfig,
	// 既存の設定を上書き
	printWidth: 120,
	// Pug設定を追加
	...pugConfig,
};
```
