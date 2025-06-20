# @d-zero/shorthand-property-use-logical

Warn when shorthand properties with multiple values could use logical properties instead.

<!-- prettier-ignore -->
```css
.example {
  padding: 2rem 1rem; /* Should warn - use logical properties */
}
/**           ↑
 * This shorthand with multiple values should use logical properties */
```

This rule complements `stylelint-use-logical` by catching shorthand properties with multiple values that the plugin doesn't currently handle.

## Options

`boolean | { properties?: string[] }`: `true` to check all supported properties, or an object with a `properties` array to limit checking.

### `true` (default)

Checks all supported shorthand properties: `padding`, `margin`, `border-width`, `border-style`, `border-color`, `scroll-padding`, `scroll-margin`, `border-radius`.

The following patterns are considered warnings:

<!-- prettier-ignore -->
```css
.example {
  padding: 2rem 1rem;
  margin: 1rem 2rem 3rem;
  border-width: 1px 2px;
}
```

The following patterns are **not** considered warnings:

<!-- prettier-ignore -->
```css
.example {
  padding: 2rem; /* Single value is fine */
  margin: auto;
  border-width: 1px;
  background: url(a.png) no-repeat; /* Not a logical property */
}
```

### `{ properties: ["padding", "margin"] }`

Only check the specified properties:

<!-- prettier-ignore -->
```css
.example {
  padding: 2rem 1rem; /* Warning */
  margin: 1rem 2rem;  /* Warning */
  border-width: 1px 2px; /* No warning - not in list */
}
```

## Logical Property Suggestions

When the rule detects a shorthand property with multiple values, it suggests appropriate logical properties:

- `padding` → `padding-block`, `padding-inline`
- `margin` → `margin-block`, `margin-inline`
- `border-width` → `border-block-width`, `border-inline-width`
- `border-style` → `border-block-style`, `border-inline-style`
- `border-color` → `border-block-color`, `border-inline-color`
- `scroll-padding` → `scroll-padding-block`, `scroll-padding-inline`
- `scroll-margin` → `scroll-margin-block`, `scroll-margin-inline`
- `border-radius` → `border-start-start-radius`, `border-start-end-radius`, `border-end-start-radius`, `border-end-end-radius`