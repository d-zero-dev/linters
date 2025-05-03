/**
 * @see https://drafts.csswg.org/css-values-4/#viewport-relative-lengths
 */
const VIEWPORT_PERCENTAGE_LENGTHS = '[ls]?v(?:w|h|i|d|max|min)';

const PERCENTATE_UNITS = `(?:%|${VIEWPORT_PERCENTAGE_LENGTHS})`;

module.exports = {
	plugins: ['@d-zero/stylelint-rules'],
	rules: {
		'declaration-property-value-disallowed-list': [
			{
				display: [
					/* @see https://drafts.csswg.org/css-display/#display-value-summary */
					'block',
					'flow-root',
					'inline',
					'inline-block',
					'list-item',
					'inline list-item',
					'flex',
					'inline-flex',
					'grid',
					'inline-grid',
					'ruby',
					'table',
					'inline-table',
				],
				'z-index': ['/^-?\\d+$/'],
				'/^(?:color|background|background-color|border|border-color|outline|outline-color)$/':
					[/#[0-9a-f]{3}/, /(?:rgb|hsl)a?\(.+?\)/],
				content: [/^"\\[0-9a-f]{1,6}"$/i],
			},
			{
				message: (name, value) => {
					switch (name) {
						case 'display': {
							let multiValue = '';
							switch (value) {
								case 'block': {
									multiValue = 'block flow';
									break;
								}
								case 'flow-root': {
									multiValue = 'block flow-root';
									break;
								}
								case 'inline': {
									multiValue = 'inline flow';
									break;
								}
								case 'inline-block': {
									multiValue = 'inline flow-root';
									break;
								}
								case 'list-item': {
									multiValue = 'block flow list-item';
									break;
								}
								case 'inline list-item': {
									multiValue = 'inline flow list-item';
									break;
								}
								case 'flex': {
									multiValue = 'block flex';
									break;
								}
								case 'inline-flex': {
									multiValue = 'inline flex';
									break;
								}
								case 'grid': {
									multiValue = 'block grid';
									break;
								}
								case 'inline-grid': {
									multiValue = 'inline grid';
									break;
								}
								case 'ruby': {
									multiValue = 'inline ruby';
									break;
								}
								case 'table': {
									multiValue = 'block table';
									break;
								}
								case 'inline-table': {
									multiValue = 'inline table';
									break;
								}
							}
							return `\`${value}\`の代わりに複数キーワード構文\`${multiValue}\`を使用してください。`;
						}
						case 'z-index': {
							return `数値の\`${name}\`ではなくグローバルで定義されたCSS変数を使用してください。`;
						}
						case 'content': {
							return `Unicode値\`${value}\`を直接指定せず、代わりに命名されたエンティティ（例: &copy;）またはCSS変数を使用してください。`;
						}
						default: {
							return `ハードコードされた値\`${value}\`の代わりにCSS変数を使用してください。`;
						}
					}
				},
				severity: 'warning',
			},
		],
		'declaration-property-value-allowed-list': {
			'font-size': [
				'inherit',
				/^\$[a-z][a-z0-9]*-font-size(?:-[a-z0-9]+)?$/,
				'1em',
				/^calc\(\s*(?:(?:\d*\.)?\d+|var\(\s*--[a-z][a-z0-9_-]+\s*\))\s*\/\s*(?:(?:\d*\.)?\d+|var\(\s*--[a-z][a-z0-9_-]+\s*\))\s*\*\s*(?:1em|1rem|100vw)\s*\)$/,
				/^(?:\d*\.)?\d+rem/,
				/^clamp\(/,
				// Custom properties
				/^var\(/,
			],
			flex: [
				/^\s*[01]\s+[01]\s.+/,
				// Custom properties
				/^var\(/,
			],
			'flex-grow': ['0', '1'],
			'flex-shrink': ['0', '1'],
		},
		'unit-disallowed-list': [
			[
				'ex',
				'ch',
				'mm',
				'q',
				'cm',
				'in',
				'pt',
				'pc',
				'vm',
				's',
				'grad',
				'rad',
				'turn',
				'vw',
				'vh',
				'vi',
				'vb',
				'vmin',
				'vmax',
			],
			{
				message: (unit) => {
					const recommendationMap = {
						ex: 'em, rem',
						ch: 'em, rem',
						mm: 'px, rem',
						q: 'px, rem',
						cm: 'px, rem',
						in: 'px, rem',
						pt: 'px, rem',
						pc: 'px, rem',
						s: 'ms',
						grad: 'deg',
						rad: 'deg',
						turn: 'deg',
						vw: 'svw, dvw, lvw',
						vh: 'svh, dvh, lvh',
						vi: 'svi, dvi, lvi',
						vb: 'svb, dvb, lvb',
						vmin: 'svmin, dvmin, lvmin',
						vmax: 'svmax, dvmax, lvmax',
					};
					return `\`${unit}\`は使用しないでください。代わりに\`${recommendationMap[unit]}\`を検討してください。`;
				},
				severity: 'warning',
			},
		],
		'value-keyword-case': [
			'lower',
			{
				ignoreProperties: [/^\$font-family-/],
			},
		],

		'@d-zero/declaration-value-type-disallowed-list': {
			'/^length|percentage$/': {
				ignoreProperties: ['font-size'],
				patterns: [
					// float
					`/[0-9]*?\\.[0-9]+?${PERCENTATE_UNITS}/`,

					// 1000% or larger
					`/[1-9][0-9]{3,}?${PERCENTATE_UNITS}/`,

					// 200% - 999%
					`/[2-9][0-9][0-9]${PERCENTATE_UNITS}/`,

					// 101% - 199%
					`/1[0-9][1-9]${PERCENTATE_UNITS}/`,
					`/1[1-9][0-9]${PERCENTATE_UNITS}/`,

					// 1% - 99%
					`/[1-9][0-9]?${PERCENTATE_UNITS}/`,
				],
			},
		},
	},
};
