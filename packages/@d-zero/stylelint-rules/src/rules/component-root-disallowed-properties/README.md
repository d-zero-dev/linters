# @d-zero/component-root-disallowed-properties

コンポーネントルート（ファイル名と一致するクラス名を持つルール）で特定のプロパティを禁止するStylelintルールです。

## 動作

**コンポーネントルートで禁止されているプロパティの使用をチェックします**

- ファイル名と完全一致するクラス名を持つルール（コンポーネントルート）のみをチェック対象とします
- コンポーネントの子要素（`__element`など）や、その他のルールではチェックしません
- 疑似クラス（`:hover`など）を含むルール内の禁止プロパティもチェック対象とします
- 疑似要素（`::before`など）を含むルール内の禁止プロパティはチェック対象外です

## 禁止プロパティ

以下のプロパティはコンポーネントルートで使用できません：

### 幅・高さ関連

- `width`, `inline-size`（`min-width`, `max-width`, `min-inline-size`, `max-inline-size`は許可）
- `height`, `block-size`（`min-height`, `max-height`, `min-block-size`, `max-block-size`は許可）

### マージン関連

- `margin`
- `margin-top`, `margin-right`, `margin-bottom`, `margin-left`
- `margin-block`, `margin-inline`
- `margin-block-start`, `margin-block-end`
- `margin-inline-start`, `margin-inline-end`

### インセット関連

- `inset`
- `inset-block`, `inset-inline`
- `top`, `right`, `bottom`, `left`

### 配置関連

- `position: absolute`
- `justify-self`, `align-self`, `place-self`

### Flex関連

- `flex`
- `flex-grow`, `flex-shrink`, `flex-basis`

### その他

- `grid-area`
- `float`
- `clear`

## 例

```css
/* button.css */

/* ❌ NG: コンポーネントルートで width は禁止 */
.button {
	width: 100px;
}

/* ✅ OK: min-width, max-width, min-height, max-height は許可 */
.button {
	min-width: 100px;
	max-width: 500px;
	min-height: 50px;
	max-height: 200px;
}

/* ✅ OK: 子要素では禁止プロパティを使用可能 */
.button__text {
	width: 100px;
	margin: 10px;
}

/* ❌ NG: コンポーネントルートで margin は禁止 */
.button {
	margin: 10px;
}

/* ❌ NG: コンポーネントルートで position: absolute は禁止 */
.button {
	position: absolute;
}

/* ✅ OK: position: relative は許可 */
.button {
	position: relative;
}
```

```scss
/* _c-component.scss */

/* ❌ NG: コンポーネントルートで width は禁止 */
.c-component {
	width: 100px;
}

/* ✅ OK: ネストされた子要素では禁止プロパティを使用可能 */
.c-component {
	&__element {
		width: 100px;
		margin: 10px;
	}
}

/* ❌ NG: 疑似クラス内で禁止プロパティは禁止 */
.c-component {
	&:hover {
		position: absolute;
		width: 100px;
	}
}

/* ✅ OK: 疑似要素内で禁止プロパティは許可 */
.c-component {
	&::before {
		position: absolute;
		width: 100px;
	}
}
```

## 特別なケース

### c-content-main

`c-content-main`クラスについては、特に`width`と`inline-size`の使用が絶対に禁止されています。幅はコンポーネントをラップする親のエレメントに指定する必要があります。
