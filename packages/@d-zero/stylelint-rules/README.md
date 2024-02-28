# `@d-zero/stylelint-rules`

Rules plugin for [stylelint](https://stylelint.io/).

## Installation

```sh
npm install @d-zero/stylelint-rules --save-dev
```

## Configuration

Add the following to your `.stylelintrc` file:

```json
{
	"plugins": ["@d-zero/stylelint-rules"],
	"rules": {
		"@d-zero/declaration-value-type-disallowed-list": {
			"length": ["/10px/"]
		}
	}
}
```

## Rules

- [`@d-zero/declaration-value-type-disallowed-list`](./src/rules/declaration-value-type-disallowed-list/)
