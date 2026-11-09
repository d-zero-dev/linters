# `@d-zero/oxlint-plugin`

Custom Oxlint rules for D-ZERO.

## Installation

```sh
npm install @d-zero/oxlint-plugin --save-dev
```

## Configuration

Add the following to your `oxlint.config.mts`:

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

## Rules

### `@d-zero/no-click-event`

Disallows click event handlers in favor of the [Invoker Commands API](https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API).

**Detected patterns:**

- `addEventListener('click', ...)`
- `element.onclick = ...`
- jQuery `.on('click', ...)` and `.click(handler)`
- React `onClick={...}`

**Not detected (v6):**

- Vue `@click` and `v-on:click` — see [MIGRATION-v6.md](../../../MIGRATION-v6.md)
