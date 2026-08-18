import type { CSSTreeModule } from './types.js';

import * as CSSTree from 'css-tree';

import SassVariable from './node/sass-variable.js';

const DELIM = 9;

const DOLLAR_SIGN = 0x00_24; // U+0024 DOLLAR SIGN ($)

const forked = CSSTree.fork(
	// @ts-ignore
	function (syntax: typeof CSSTree) {
		// @ts-ignore
		const scope = syntax.scope;
		const getNode = scope.Value.getNode;

		return {
			...syntax,
			scope: {
				...scope,
				Value: {
					...scope.Value,
					// @ts-ignore
					getNode: function (context) {
						// @ts-ignore
						switch (this.tokenType) {
							case DELIM: {
								// @ts-ignore
								// oxlint-disable-next-line unicorn/prefer-code-point -- this is css-tree's TokenStream, not a string; it has no codePointAt
								const code = this.charCodeAt(this.tokenStart);

								if (code === DOLLAR_SIGN) {
									// @ts-ignore
									return this.SassVariable();
								}
							}
						}

						return getNode.call(this, context);
					},
				},
			},
			node: {
				// @ts-ignore
				...syntax.node,
				SassVariable,
			},
		};
	},
);

export type * from './types.js';

export default {
	...CSSTree,
	...forked,
} as CSSTreeModule;
