import js from '@eslint/js';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const codeFiles = ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'];
const javaScriptFiles = ['**/*.{js,mjs,cjs}'];
const typeScriptFiles = ['**/*.{ts,mts,cts,tsx}'];

const scopeConfigs = (configs, files) =>
	configs.map(config => ({
		...config,
		files,
	}));

export default [
	{
		name: '@mikode13/code-quality/ignores',
		ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', '**/.cache/**'],
	},
	{
		...js.configs.recommended,
		name: '@mikode13/code-quality/javascript-recommended',
		files: codeFiles,
		languageOptions: {
			...js.configs.recommended.languageOptions,
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
	},
	{
		name: '@mikode13/code-quality/javascript-tooling-environment',
		files: javaScriptFiles,
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	...scopeConfigs(tseslint.configs.strictTypeChecked, typeScriptFiles),
	...scopeConfigs(tseslint.configs.stylisticTypeChecked, typeScriptFiles),
	{
		name: '@mikode13/code-quality/import-hygiene',
		files: codeFiles,
		plugins: {
			'import-x': importX,
		},
		settings: {
			...importX.flatConfigs.typescript.settings,
			'import-x/resolver-next': [createTypeScriptImportResolver()],
		},
		rules: {
			...importX.flatConfigs.typescript.rules,
			'import-x/no-cycle': 'error',
			'import-x/no-duplicates': 'error',
		},
	},
	{
		name: '@mikode13/code-quality/type-aware',
		files: typeScriptFiles,
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
		},
		rules: {
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					disallowTypeAnnotations: false,
					fixStyle: 'separate-type-imports',
					prefer: 'type-imports',
				},
			],
		},
	},
	{
		name: '@mikode13/code-quality/disable-directives',
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
			reportUnusedInlineConfigs: 'error',
		},
	},
];
