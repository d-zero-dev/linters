const IDENTIFIER = 1;
const DELIM = 9;

export default {
	name: 'SassVariable',
	structure: {
		name: String,
	},
	// @ts-ignore
	parse: function SassVariable() {
		// @ts-ignore
		const start = this.tokenStart;

		// @ts-ignore
		this.eat(DELIM);

		return {
			type: 'SassVariable',
			// @ts-ignore
			loc: this.getLocation(start, this.tokenEnd),
			// @ts-ignore
			name: this.consume(IDENTIFIER),
		};
	},
	// @ts-ignore
	generate: function (node) {
		return '$' + node.name;
	},
};
