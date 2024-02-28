# @d-zero/declaration-value-type-disallowed-list

Specify a list of allowed values according to type within declarations.

<!-- prettier-ignore -->
```css
a { flex: 0 1 100px; }
/**           ↑
 * These value and "<length>" as its type */
```

The **type** is derived by [CSSTree](https://csstree.github.io/docs/syntax/#report&title=Types&q=ZGljdC5bdHlwZT0iVHlwZSJd) and is limited to those registered with it.

## Options

`object`: `{ "type-name": ["array", "of", "value", "pattern"] | { "patterns": ["array", "of", "value", "pattern"], "ignoreProperties": ["array", "of", "property"] } }`

Given:

```json
{
	"length": ["/[0-9]+px/"],
	"/^length|parcentage$/": ["100vw"],
	"number": {
		"patterns": ["[0-9]+", "0"],
		"ignoreProperties": ["line-height"]
	}
}
```
