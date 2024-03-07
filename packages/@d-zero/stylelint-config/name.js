module.exports = {
	rules: {
		'custom-media-pattern': '[a-z][a-z-]*',
		'custom-property-pattern': '[a-z][a-z-]*',
		'selector-class-pattern': [
			'^c-[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?$',
			{
				resolveNestedSelectors: true,
				/**
				 * @param {string} selector
				 * @returns {string}
				 */
				message: (selector) => {
					if (!selector.startsWith('.c-')) {
						return `クラス名は「c-」から始めてください: ${selector}`;
					}
					if (selector.split('__').length > 2) {
						return `「__」はコンポーネント名とエレメント名の区切りを表します。エレメント名の文字区切りは「-」を使います: ${selector}`;
					}
					return `クラス名に命名規則にない文字が含まれています: ${selector}`;
				},
			},
		],
		'selector-nested-pattern': [
			'^[^.]+.*',
			{
				/**
				 * @param {string} selector
				 * @returns {string}
				 */
				message: (selector) => {
					return `コンポーネントのスタイル定義の中で別のコンポーネントを定義してはいけません: ${selector}`;
				},
			},
		],

		'scss/dollar-variable-pattern':
			'^(?:[a-z]{2,}-[a-z0-9-]+|_[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$',
		'scss/percent-placeholder-pattern': '^[a-z]{2,}(-[a-z0-9-]+)?$',
	},
};
