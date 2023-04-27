module.exports = {
	files: ['test/**/*.test.ts'],
	extensions: ['ts'],
	require: ['ts-node/register/transpile-only', 'esm'],
	nodeArguments: ['--loader=ts-node/esm']
};
