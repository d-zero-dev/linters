# `@d-zero/prettier-config`

## 個別インストール

```sh
npm install -D @d-zero/prettier-config
```

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
