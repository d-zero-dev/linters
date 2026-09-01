# `@d-zero/eslint-config`

## 個別インストール

```sh
npm install -D @d-zero/eslint-config
```

## 使い方

`eslint.config.js`を作成し、`import`からコンフィグデータを読み込みます。

```js
import dz from '@d-zero/eslint-config';

/**
 * @type {import('eslint').ESLint.ConfigData[]}
 */
export default [...dz.configs.frontend];
```

### 拡張

プロジェクトに合わせて設定を追加します。

```js
import dz from '@d-zero/eslint-config';

/**
 * @type {import('eslint').ESLint.ConfigData[]}
 */
export default [
	...dz.configs.frontend,
	{
		rules: {
			// 例: console.logを許可する
			'no-console': 0,
		},
	},
];
```

### プリセット

以下のプリセットが用意されています。

| プロパティ         | 型       | 説明                                                                                                                                                                                                                            |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configs.base`     | `Array`  | Oxlint と併用する前提の共通設定。Oxlint に実装がない領域（regexp・jsdoc の主要チェック・`import-x/no-extraneous-dependencies`・`import-x/order`・`sort-class-members`等）のみ検査。TypeScript ファイルは対象外（Oxlint が検査） |
| `configs.frontend` | `Array`  | `configs.base`に加え、DOM/Vue/React 向けの`@d-zero/no-click-event`を検査するフロントエンド開発用                                                                                                                                |
| `configs.commonjs` | `Object` | CommonJS用単一設定                                                                                                                                                                                                              |
