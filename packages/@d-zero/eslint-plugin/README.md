# `@d-zero/eslint-plugin`

Custom ESLint rules for D-ZERO.

## Installation

```sh
npm install @d-zero/eslint-plugin --save-dev
```

## Configuration

Add the following to your `eslint.config.js`:

```js
import dzeroPlugin from '@d-zero/eslint-plugin';

export default [
	{
		plugins: {
			'@d-zero': dzeroPlugin,
		},
		rules: {
			'@d-zero/no-click-event': 'warn',
		},
	},
];
```

## Rules

### `@d-zero/no-click-event`

Disallows click event handlers in favor of the [Invoker Commands API](https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API).

**Detected patterns:**

- `addEventListener('click', ...)`
- `element.onclick = ...`
- jQuery `.on('click', ...)` and `.click()`
- React `onClick={...}`
- Vue `@click` and `v-on:click`
