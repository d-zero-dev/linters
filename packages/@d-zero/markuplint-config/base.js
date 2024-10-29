/**
 * @type {import('@markuplint/ml-config').Config}
 */
export default {
	extends: ['markuplint:recommended-static-html'],
	rules: {
		'disallowed-element': {
			value: ['br'],
			reason:
				'br要素は原則使用しません。代わりにCSSでスタイルを調整してください。使用する場合は場合は理由が必要です。（D-ZERO独自ルール）',
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
	],
};
