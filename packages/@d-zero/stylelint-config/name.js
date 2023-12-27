module.exports = {
	rules: {
		'scss/dollar-variable-pattern':
			'^(?:[a-z]{2,}-[a-z0-9-]+|_[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$',
		'scss/percent-placeholder-pattern': '^[a-z]{2,}(-[a-z0-9-]+)?$',
		'custom-media-pattern': '[a-z][a-z-]*',
		'custom-property-pattern': '[a-z][a-z-]*',
		'selector-class-pattern': [
			'^c-[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?$',
			{
				resolveNestedSelectors: true,
			},
		],
		'selector-id-pattern': '^$',
		'selector-nested-pattern': '^[^.]+.*',
	},
};
