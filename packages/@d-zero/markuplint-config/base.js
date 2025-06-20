/**
 * @type {import('@markuplint/ml-config').Config}
 */
export default {
	extends: ['markuplint:recommended-static-html'],
	rules: {
		'disallowed-element': {
			value: ['br'],
			reason:
				'br要素は原則使用しません。代わりにCSSでスタイルを調整してください。使用する場合は理由が必要です。（D-ZERO独自ルール）',
		},
	},
	nodeRules: [
		{
			selector: "script[src^='https://'], script[src^='https://']",
			rules: {
				'required-attr': false,
			},
		},
		{
			selector: 'html',
			rules: {
				// <html prefix="og: http://ogp.me/ns#">
				'invalid-attr': {
					options: {
						allowAttrs: [
							{
								name: 'prefix',
								value: 'Any',
							},
						],
					},
				},
			},
		},
		{
			selector: 'img',
			rules: {
				// https://github.com/markuplint/markuplint/blob/c35e0beb5e14093a41cee7634221dbe7f7d577f9/packages/%40markuplint/config-presets/src/preset.performance.json#L25-L35 の設定を上書き
				// width, height の指定は上書きされるため、省略可能になるが、ビルド時に自動的に付与されるため問題なしとする
				'required-attr': {
					value: 'alt',
					reason:
						'省略可能なケースがほとんど想定されないため、原則禁止としています。省略する場合は明確な理由が必要です。（D-ZERO独自ルール）',
				},
				'invalid-attr': {
					options: {
						disallowAttrs: [
							{
								name: 'src',
								value: { pattern: '/[A-Z\\s@#$%^&*()+=\\[\\]{}|;\':",<>?]/' },
							},
						],
					},
					reason:
						'画像ファイル名は命名規則に従って小文字、数字、ハイフン、アンダースコア、ドット、スラッシュのみを使用してください。（D-ZERO独自ルール）',
				},
			},
		},
		{
			selector: 'a',
			rules: {
				'required-attr': {
					value: 'href',
					reason:
						'省略可能なケースがほとんど想定されないため、原則禁止としています。省略する場合は明確な理由が必要です。（D-ZERO独自ルール）',
				},
				'invalid-attr': {
					options: {
						disallowAttrs: [
							{
								name: 'href',
								value: { pattern: '/^javascript:/i' },
							},
						],
					},
					reason:
						'JavaScriptのリンクは使用しないでください。代わりに`button`要素を使用してください。',
				},
			},
		},
	],
};
