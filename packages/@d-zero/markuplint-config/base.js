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
				'required-attr': {
					value: 'alt',
					reason:
						'省略可能なケースがほとんど想定されないため、原則禁止としています。省略する場合は明確な理由が必要です。（D-ZERO独自ルール）',
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
