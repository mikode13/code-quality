import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';

import { ESLint } from 'eslint';

import base from '@mikode13/code-quality/base';
import react from '@mikode13/code-quality/react';

const baseFixture = fileURLToPath(new URL('fixtures/base/', import.meta.url));
const reactFixture = fileURLToPath(new URL('fixtures/react/', import.meta.url));

const lintFixture = async (cwd, config, patterns) => {
	const eslint = new ESLint({
		cwd,
		overrideConfig: config,
		overrideConfigFile: true,
	});

	return eslint.lintFiles(patterns);
};

const messagesFrom = results => results.flatMap(result => result.messages);

test('base export is an extensible flat config array', async () => {
	assert.ok(Array.isArray(base));

	const eslint = new ESLint({
		cwd: baseFixture,
		overrideConfig: [
			...base,
			{
				files: ['**/*.ts'],
				rules: {
					eqeqeq: 'error',
				},
			},
		],
		overrideConfigFile: true,
	});
	const config = await eslint.calculateConfigForFile('src/valid.ts');

	assert.equal(config.rules.eqeqeq[0], 2);
});

test('base accepts valid typed source, separate test tsconfigs, and JavaScript tooling', async () => {
	const results = await lintFixture(baseFixture, base, [
		'src/valid.ts',
		'tests/valid.test.ts',
		'tooling.config.js',
	]);

	assert.deepEqual(messagesFrom(results), []);
});

test('base reports typed correctness and import-hygiene failures', async () => {
	const results = await lintFixture(baseFixture, base, ['src/invalid/**/*.ts']);
	const ruleIds = new Set(messagesFrom(results).map(message => message.ruleId));

	assert.ok(ruleIds.has('@typescript-eslint/no-floating-promises'));
	assert.ok(ruleIds.has('@typescript-eslint/consistent-type-imports'));
	assert.ok(ruleIds.has('import-x/no-cycle'));
});

test('React export accepts valid React 18 and 19 components', async () => {
	assert.ok(Array.isArray(react));

	const results = await lintFixture(reactFixture, react, [
		'src/valid.tsx',
		'src/react-18-valid.tsx',
	]);

	assert.deepEqual(messagesFrom(results), []);
});

test('React export reports React, Hooks, and accessibility failures', async () => {
	const results = await lintFixture(reactFixture, react, ['src/invalid.tsx']);
	const ruleIds = new Set(messagesFrom(results).map(message => message.ruleId));

	assert.ok(ruleIds.has('@eslint-react/no-missing-key'));
	assert.ok(ruleIds.has('react-hooks/rules-of-hooks'));
	assert.ok(ruleIds.has('jsx-a11y-x/alt-text'));
});
