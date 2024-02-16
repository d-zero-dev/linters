module.exports = {
	extends: ['stylelint-config-recess-order'],
	plugins: ['stylelint-order'],
	rules: {
		'order/order': [
			'dollar-variables',
			'custom-properties',
			{
				type: 'at-rule',
				name: 'custom-media',
			},
			{
				type: 'at-rule',
				name: 'extend',
			},
			{
				type: 'at-rule',
				name: 'mixin',
			},
			'declarations',
			{
				type: 'at-rule',
				name: 'supports',
			},
			{
				type: 'at-rule',
				name: 'media',
				hasBlock: true,
			},
			'rules',
		],
	},
};
