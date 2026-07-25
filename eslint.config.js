import base from './src/base.js';

export default [
	...base,
	{
		name: '@mikode13/code-quality/internal-ignores',
		ignores: ['test/fixtures/**'],
	},
];
