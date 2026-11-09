# `@d-zero/oxlint-config`

## 個別インストール

```sh
npm install -D @d-zero/oxlint-config
```

## 使い方

`oxlint.config.mts`（TypeScript を使わないプロジェクトでは`oxlint.config.mjs`）を作成し、`import`から設定を読み込みます。

```ts
import config from '@d-zero/oxlint-config';

export default {
	...config,
};
```

### 拡張

プロジェクトに合わせて設定を追加します。

```ts
import config from '@d-zero/oxlint-config';

export default {
	...config,
	rules: {
		...config.rules,
		// 例: no-consoleを無効にする
		'no-console': 'off',
	},
};
```

### `@d-zero/oxlint-plugin`との併用

D-ZERO 独自ルールを利用する場合は[`@d-zero/oxlint-plugin`](../oxlint-plugin/)を`jsPlugins`に追加します。

```ts
import config from '@d-zero/oxlint-config';

export default {
	...config,
	jsPlugins: ['@d-zero/oxlint-plugin'],
	rules: {
		...config.rules,
		'@d-zero/no-click-event': 'warn',
	},
};
```
