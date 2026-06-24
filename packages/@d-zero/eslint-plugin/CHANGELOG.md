# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [6.0.0-alpha.2](https://github.com/d-zero-dev/linters/compare/v6.0.0-alpha.1...v6.0.0-alpha.2) (2026-06-24)

**Note:** Version bump only for package @d-zero/eslint-plugin

# [6.0.0-alpha.1](https://github.com/d-zero-dev/linters/compare/v6.0.0-alpha.0...v6.0.0-alpha.1) (2026-06-24)

# [5.1.0](https://github.com/d-zero-dev/linters/compare/v5.0.0...v5.1.0) (2026-04-08)

**Note:** Version bump only for package @d-zero/eslint-plugin

# [5.1.0](https://github.com/d-zero-dev/linters/compare/v5.0.0...v5.1.0) (2026-04-08)

### Bug Fixes

- **eslint-plugin:** allow jQuery .click() without arguments as programmatic click execution ([afcd9fa](https://github.com/d-zero-dev/linters/commit/afcd9fae568ab51ec043e79668c4d7794ef96848))
- **eslint:** avoid false positives for non-jQuery .click() calls ([901c810](https://github.com/d-zero-dev/linters/commit/901c8105d419a8ba52e5c9204e671d8960b67d26))

### Features

- **eslint-plugin:** add new package with no-click-event rule ([692651c](https://github.com/d-zero-dev/linters/commit/692651cce7a78bf09872201a09f70ec3a84bda5e))

# Changelog

All notable changes to this project will be documented in this file.

## [5.0.0] - TBD

### Added

- Initial release of @d-zero/eslint-plugin
- Added `no-click-event` rule to discourage click event handlers in favor of Invoker Commands API
  - Detects `addEventListener('click')`
  - Detects `onclick` IDL property assignment
  - Detects jQuery `.on('click')` and `.click()`
  - Detects React `onClick` JSX attribute
  - Detects Vue `@click` and `v-on:click`
