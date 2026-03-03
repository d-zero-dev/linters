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
