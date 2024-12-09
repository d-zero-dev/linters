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

| プロパティ             | 型       | 説明                                               |
| ---------------------- | -------- | -------------------------------------------------- |
| `configs.frontend`     | `Array`  | フロントエンド開発用                               |
| `configs.frontendNoTS` | `Array`  | フロントエンド開発用（TypeScriptを利用しない場合） |
| `configs.node`         | `Array`  | Node.js開発用                                      |
| `configs.nodeNoTS`     | `Array`  | Node.js開発用（TypeScriptを利用しない場合）        |
| `configs.standard`     | `Array`  | `config.node`と同じ                                |
| `configs.base`         | `Array`  | `config.nodeNoTS`と同じ                            |
| `configs.commonjs`     | `Object` | CommonJS用単一設定                                 |
