const IDENTIFIER = 1;
const DELIM = 9;

export default {
	name: 'SassVariable',
	structure: {
		name: String,
	},
	// `this` is the css-tree parser context bound at call time, not a class instance.
	/* eslint-disable unicorn/no-this-outside-of-class */
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
	/* eslint-enable unicorn/no-this-outside-of-class */
	// @ts-ignore
	generate: function (node) {
		return '$' + node.name;
	},
};
