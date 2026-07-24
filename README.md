# @mikode13/code-quality

Shared ESLint code-quality configuration for MiKode projects.

> **Status:** Experimental. The API may change before version `1.0.0`.

## Installation

Install the package alongside ESLint:

```sh
pnpm add --save-dev @mikode13/code-quality eslint
```

## Usage

Create `eslint.config.js` in the consuming project:

```js
export { default } from '@mikode13/code-quality/base';
```

For a React project, use the React entry point instead:

```js
export { default } from '@mikode13/code-quality/react';
```

Run ESLint with pnpm:

```sh
pnpm exec eslint .
```

The initial scaffold currently includes ESLint's recommended JavaScript rules. The
type-aware TypeScript and React rule sets are placeholders for the package's first feature
implementation.

## License

This package is source-available under the MIT License with the Commons Clause License
Condition v1.0. It is not released under an MIT-only or open-source license. See
[`LICENSE`](LICENSE) for the complete terms.
