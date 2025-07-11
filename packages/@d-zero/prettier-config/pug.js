import * as pug from '@prettier/plugin-pug';

export default {
	plugins: [pug],
	pugAttributeSeparator: 'as-needed',
	pugCommentPreserveSpaces: 'trim-all',
	pugEmptyAttributes: 'none',
	pugSingleQuote: false,
	pugSortAttributesBeginning: ['class'],
	pugSortAttributesEnd: ['id'],
};
