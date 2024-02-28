// eslint-disable-next-line import/no-duplicates
import type * as CSSTree from 'css-tree';
// eslint-disable-next-line import/no-duplicates
import type { LexerMatchResult } from 'css-tree';

/**
 * @see https://github.com/csstree/csstree/blob/master/lib/index.js
 */
export type CSSTreeModule = typeof CSSTree & {
	lexer: LexerEx;
	createLexer: unknown; // typeof CSSTree.createLexer;
	tokenize: unknown; // typeof CSSTree.tokenize;
	parse: typeof CSSTree.parse;
	generate: typeof CSSTree.generate;
	walk: typeof CSSTree.walk;
	find: typeof CSSTree.find;
	findLast: typeof CSSTree.findLast;
	findAll: typeof CSSTree.findAll;
	fromPlainObject: typeof CSSTree.fromPlainObject;
	toPlainObject: typeof CSSTree.toPlainObject;
	fork(...args: Parameters<typeof CSSTree.fork>): CSSTreeModule;
	fork(
		fn: (syntax: CSSTreeModule, assign: typeof Object.assign) => CSSTreeModule,
	): CSSTreeModule;
};

interface LexerEx extends CSSTree.Lexer {
	matchProperty(
		...args: Parameters<CSSTree.Lexer['matchProperty']>
	): LexerMatchResultMatched | LexerMatchResultMismatch;
}

interface LexerMatchResultMatched extends LexerMatchResult {
	matched: PropertyToken;
}

interface LexerMatchResultMismatch extends LexerMatchResult {
	matched: null;
	iterations: number;
	error: SyntaxError & {
		rawMessage: string;
		syntax: string;
		css: string;
		mismatchOffset: number;
		mismatchLength: number;
		offset: number;
		line: number;
		column: number;
		loc: Record<string, unknown>;
	};
}

type Syntax<S extends 'Property' | 'Type' | 'Keyword'> = {
	type: S;
	name: string;
};

export type PropertyToken = {
	syntax: Syntax<'Property'>;
	match: (PropertyToken | TypeToken | KeywordToken)[];
};

export type TypeToken = {
	syntax: Syntax<'Type'> & {
		opts: null | Record<string, string>;
	};
	match: (TypeToken | KeywordToken)[];
};

export type KeywordToken = {
	syntax: Syntax<'Keyword'>;
	token: string;
	node: null;
};
