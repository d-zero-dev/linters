/**
 * @type {import('@markuplint/ml-config').Config}
 */
export default {
	extends: ['markuplint:recommended-static-html', 'markuplint:compat'],
	rules: {
		// Markuplint v5 の markuplint:html-standard から外れたが（https://markuplint.dev/docs/migration/v4-to-v5/rules/rule-names#preset-changes）、v4 では検出していたため維持する
		'no-ineffective-attr': true,
		'no-duplicate-dt': true,
		// markuplint:compat の検査のうち、D-ZERO 独自ルール（d-zero/button-require-command など）が必須にする属性は対象ブラウザーにかかわらず報告しない
		// 報告すると、属性を外せば D-ZERO 独自ルールに、残せばこの検査に違反し、どちらを選んでも lint が通らないため
		'no-unsupported-browser-features': {
			options: {
				ignoreFeatures: ['button[command]', 'button[commandfor]'],
			},
		},
		'no-restricted-element': {
			value: ['br'],
			reason:
				'br要素は原則使用しません。代わりにCSSでスタイルを調整してください。使用する場合は理由が必要です。（D-ZERO独自ルール）',
		},
		// width, height はビルド時に自動的に付与されるため、省略可能とする
		// require-attr をベースルール名で上書きすると require-attr を包むプリセットの他の検査まで変わるため、該当する名前付きルールだけを無効にする
		'performance/img-aspect-ratio': false,
	},
	nodeRules: [
		// 次の 2 つはプリセットの検査を緩めるのが目的なので名前を付けない
		// 名前なしの nodeRule でベースルールに指定した値と options は、そのベースルールを包むプリセットの名前付きルールにも伝わる
		{
			selector: "script[src^='https://']",
			rules: {
				'require-attr': false,
			},
		},
		{
			selector: 'html',
			rules: {
				// <html prefix="og: http://ogp.me/ns#">
				// 移行ガイドは allowAttrs を no-disallowed-attr と no-invalid-attr-value にも振り分けるとするが、仕様に無い prefix を報告するのは no-unknown-attr だけなので、ここにだけ書く
				'no-unknown-attr': {
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
		// 以降は検査を足す D-ZERO 独自ルールなので name を付けて独立した名前付きルールにする
		// 名前なしだと値と options が同じベースルールを包むプリセットの名前付きルール（html-standard/required-attr、a11y/no-accesskey など）にも伝わり、二重報告とプリセット側の検査の欠落を起こす
		{
			name: 'd-zero/img-require-alt',
			selector: 'img',
			rules: {
				'require-attr': {
					value: 'alt',
					// require-attr は value に加えて仕様上の必須属性も検査するため、外さないと src/srcset の欠落が html-standard/required-attr と二重に報告される
					options: {
						ignoreAttrs: ['src', 'srcset'],
					},
					reason:
						'省略可能なケースがほとんど想定されないため、原則禁止としています。省略する場合は明確な理由が必要です。（D-ZERO独自ルール）',
				},
			},
		},
		{
			name: 'd-zero/img-src-naming',
			selector:
				'img:not([src^="data:"], [src^="blob:"], [src^="https://"], [src^="http://"], [src^="//"])',
			rules: {
				'no-restricted-attr': {
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
			name: 'd-zero/media-src-naming',
			selector: 'video, audio, source',
			rules: {
				'no-restricted-attr': {
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
			name: 'd-zero/a-require-href',
			selector: 'a',
			rules: {
				'require-attr': {
					value: 'href',
					reason:
						'省略可能なケースがほとんど想定されないため、原則禁止としています。省略する場合は明確な理由が必要です。（D-ZERO独自ルール）',
				},
			},
		},
		{
			name: 'd-zero/a-no-javascript-href',
			selector: 'a',
			rules: {
				'no-restricted-attr': {
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
				'require-attr': {
					value: 'command',
					reason:
						'button要素には原則としてcommand属性が必要です。Invoker Commands APIを使用してアクセシブルなUIを実装してください。role属性を持つボタン（role="tab"など）やtype="submit"/type="reset"/typeなしのボタンは例外として許可されます。（D-ZERO独自ルール）',
				},
			},
		},
		{
			name: 'd-zero/button-require-commandfor',
			selector: 'button[popovertarget]',
			rules: {
				'require-attr': {
					value: 'commandfor',
					reason:
						'popovertarget属性の代わりにcommandfor属性を使用してください。popovertarget属性は将来的に非推奨となる予定です。（D-ZERO独自ルール）',
				},
			},
		},
		{
			name: 'd-zero/popovertargetaction-require-command',
			selector: 'button[popovertargetaction]',
			rules: {
				'require-attr': {
					value: 'command',
					reason:
						'popovertargetaction属性（show/hide/toggle）の代わりにcommand属性（show-popover/hide-popover/toggle-popover）を使用してください。（D-ZERO独自ルール）',
				},
			},
		},
	],
};
