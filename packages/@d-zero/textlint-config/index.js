module.exports = {
	plugins: ['html'],
	rules: {
		'preset-japanese': {
			'max-ten': 3,
			'sentence-length': false,
			'spellcheck-tech-word': false,
			'no-doubled-joshi': false,
		},
		'preset-ja-spacing': {
			'ja-space-between-half-and-full-width': false,
			'ja-no-space-between-full-width': false,
			'ja-no-space-around-parentheses': false,
		},
		'preset-jtf-style': {
			'2.2.3.一部の助数詞の表記': false,
			'3.1.1.全角文字と半角文字の間': false,
			'3.1.2.全角文字どうし': false,
			'3.3.かっこ類と隣接する文字の間のスペースの有無': false,
			'4.2.7.コロン(：)': false,
			'4.3.1.丸かっこ（）': false,
		},
	},
};
