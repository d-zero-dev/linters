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
			},
		},
		{
			selector:
				'img:not([src^="data:"], [src^="blob:"], [src^="https://"], [src^="http://"], [src^="//"])',
			rules: {
				'invalid-attr': {
					options: {
						disallowAttrs: [
							{
								name: 'src',
								value: { pattern: '/[A-Z\\s_]/' },
							},
						],
					},
					reason:
						'画像ファイル名は小文字のケバブケース（ハイフン区切り）で命名してください。大文字、スペース、アンダースコアは使用できません。（D-ZERO独自ルール）',
				},
			},
		},
		{
			selector: 'video, audio, source',
			rules: {
				'invalid-attr': {
					options: {
						disallowAttrs: [
							{
								name: 'src',
								value: { pattern: '/[A-Z\\s_]/' },
							},
							{
								name: 'poster',
								value: { pattern: '/[A-Z\\s_]/' },
							},
						],
					},
					reason:
						'メディアファイル名は小文字のケバブケース（ハイフン区切り）で命名してください。大文字、スペース、アンダースコアは使用できません。（D-ZERO独自ルール）',
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
		{
			selector: 'button[type=button]:not([role]):not([popovertarget])',
			rules: {
				'required-attr': {
					value: 'command',
					reason:
						'button要素には原則としてcommand属性が必要です。Invoker Commands APIを使用してアクセシブルなUIを実装してください。role属性を持つボタン（role="tab"など）やtype="submit"/type="reset"/typeなしのボタンは例外として許可されます。（D-ZERO独自ルール）',
				},
			},
		},
		{
			selector:
				'button[popovertarget]:not([command]):not([role]):not([type=submit]):not([type=reset])',
			rules: {
				'required-attr': {
					value: 'command',
					reason:
						'popovertarget属性の代わりにInvoker Commands API（commandfor/command属性）の使用を推奨します。commandfor属性とshow-popover/hide-popover/toggle-popoverコマンドを使用してください。popovertargetは将来的に非推奨となる予定です。（D-ZERO独自ルール）',
				},
			},
		},
	],
};
