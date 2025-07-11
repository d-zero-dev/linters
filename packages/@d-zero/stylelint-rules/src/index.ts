import component from './rules/component/index.js';
import declarationValueTypeDisallowedList from './rules/declaration-value-type-disallowed-list/index.js';
import preferIndividualTransformProperties from './rules/prefer-individual-transform-properties/index.js';
import shorthandPropertyUseLogical from './rules/shorthand-property-use-logical/index.js';

export default [
	component,
	declarationValueTypeDisallowedList,
	preferIndividualTransformProperties,
	shorthandPropertyUseLogical,
];
