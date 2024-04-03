export default {
	extends: ['markuplint:recommended'],
	parser: {
		'.pug$': '@markuplint/pug-parser',
	},
	rules: {
		'character-reference': false,
		'class-naming': {
			severity: 'error',
			value: '/^c-(?<ComponentName>[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/',
			reason:
				'クラス名の形式はディーゼロのコーディングガイドラインに則って命名する必要があります。 http://tmpl.d-zero.com/__guideline/coding-guideline/html.html#%F0%9F%92%8E-%E3%82%B3%E3%83%B3%E3%83%9B%E3%82%9A%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88',
		},
	},
	nodeRules: [
		{
			selector: "script[src^='https://']",
			rules: {
				'required-attr': false,
			},
		},
	],
	childNodeRules: [
		{
			regexSelector: {
				attrName: 'class',
				attrValue: '/^c-(?<ComponentName>[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/',
			},
			inheritance: true,
			rules: {
				'class-naming': {
					severity: 'error',
					value: [
						'/^c-{{ ComponentName }}__[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/',
						'/^c-(?!{{ ComponentName }})[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/',
						'/^c-{{ ComponentName }}[a-z0-9]*(?:-[a-z0-9]+)*$/',
					],
					reason:
						'ディーゼロのコーディングガイドラインではコンポーネントの中はそのコンポーネントのエレメントか、他のコンポーネントである必要があります。 http://tmpl.d-zero.com/__guideline/coding-guideline/html.html#%E3%82%B3%E3%83%B3%E3%83%9B%E3%82%9A%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%81%AE%E6%A7%8B%E6%88%90%E3%81%A8%E3%82%AF%E3%83%A9%E3%82%B9%E5%91%BD%E5%90%8D%E8%A6%8F%E5%89%87',
				},
			},
		},
		{
			selector: "[class='c-content-main']",
			inheritance: true,
			rules: {
				'class-naming': {
					severity: 'error',
					value: '/^(?!c-).+$|^$/',
					reason:
						'ディーゼロのコーディングガイドラインでは「c-content-main」の中は「c-」で始めないルールとなっています。 http://tmpl.d-zero.com/__guideline/coding-guideline/html.html#%E3%82%A8%E3%83%AC%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E3%82%AF%E3%83%A9%E3%82%B9%E3%81%AE%E4%BE%8B%E5%A4%96%E3%81%A8%E3%82%AF%E3%83%A9%E3%82%B9%E8%BF%BD%E5%8A%A0%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%AB',
				},
			},
		},
	],
};
