import type { CSSTreeModule } from './types.js';

import * as CSSTree from 'css-tree';

import SassVariable from './node/sass-variable.js';

const DELIM = 9;

const DOLLAR_SIGN = 0x00_24; // U+0024 DOLLAR SIGN ($)

const forked = CSSTree.fork(
	// @ts-ignore
	function (syntax: typeof CSSTree, assign: typeof Object.assign) {
		// @ts-ignore
		const scope = syntax.scope;
		const getNode = scope.Value.getNode;

		return assign(syntax, {
			scope: assign(scope, {
				Value: assign(scope.Value, {
					// @ts-ignore
					getNode: function (context) {
						// @ts-ignore
						switch (this.tokenType) {
							case DELIM: {
								// @ts-ignore
								// eslint-disable-next-line unicorn/prefer-code-point
								const code = this.charCodeAt(this.tokenStart);

								if (code === DOLLAR_SIGN) {
									// @ts-ignore
									return this.SassVariable();
								}
							}
						}

						return getNode.call(this, context);
					},
				}),
			}),
			// @ts-ignore
			node: assign(syntax.node, {
				SassVariable,
			}),
		});
	},
);

export * as CSSTree from 'css-tree';
export type * from './types.js';

export default {
	...CSSTree,
	...forked,
} as CSSTreeModule;
