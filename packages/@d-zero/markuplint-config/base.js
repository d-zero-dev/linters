/**
 * @type {import('@markuplint/ml-config').Config}
 */
export default {
	extends: ['markuplint:recommended-static-html'],
	rules: {
		// markuplint:recommended-static-html (performance preset) の
		// img[src] に対する width, height 必須ルールを無効化
		// width, height はビルド時に自動的に付与されるため問題なしとする
		'performance/img-aspect-ratio': false,
		'd-zero/no-br': {
			rules: {
				'disallowed-element': {
					value: ['br'],
					reason:
						'br要素は原則使用しません。代わりにCSSでスタイルを調整してください。使用する場合は理由が必要です。（D-ZERO独自ルール）',
				},
			},
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
			name: 'd-zero/html-allow-prefix-attr',
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
			name: 'd-zero/img-require-alt',
			selector: 'img',
			rules: {
				'required-attr': {
					value: 'alt',
					reason:
						'省略可能なケースがほとんど想定されないため、原則禁止としています。省略する場合は明確な理由が必要です。（D-ZERO独自ルール）',
				},
			},
		},
		{
			name: 'd-zero/img-src-kebab-case',
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
			name: 'd-zero/media-src-kebab-case',
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
			name: 'd-zero/a-href-convention',
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
			name: 'd-zero/button-require-command',
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
			name: 'd-zero/button-prefer-commandfor',
			selector: 'button[popovertarget]',
			rules: {
				'required-attr': {
					value: 'commandfor',
					reason:
						'popovertarget属性の代わりにcommandfor属性を使用してください。popovertarget属性は将来的に非推奨となる予定です。（D-ZERO独自ルール）',
				},
			},
		},
		{
			name: 'd-zero/button-prefer-command-action',
			selector: 'button[popovertargetaction]',
			rules: {
				'required-attr': {
					value: 'command',
					reason:
						'popovertargetaction属性（show/hide/toggle）の代わりにcommand属性（show-popover/hide-popover/toggle-popover）を使用してください。（D-ZERO独自ルール）',
				},
			},
		},
	],
};
