# Justa-Table Changelog

### Master

- [#79](https://github.com/cball/justa-table/pull/79)
  - Replace smoke and mirrors with simpler solution.
  - Make hideOffscreenContent configurable.
  - Use wheel listener to scroll fixed columns instead of having a double scrollbar.
  - Use Chrome only for testing.

### 0.2.1 (April 6, 2016)

- [#74](https://github.com/cball/justa-table/pull/74) [BUGFIX] Only add scrollbar height to tables if needed (WIN + has horizontal scrollbar).

### 0.2.0 (April 6, 2016)

- [#72](https://github.com/cball/justa-table/pull/72) [FEATURE] Reduce size of table when the height of all rows < `tableHeight`.
- [#71](https://github.com/cball/justa-table/pull/71) [BUGFIX] Reflow headers when header re-renders.
- [#70](https://github.com/cball/justa-table/pull/70) [BUGFIX] Scroll to the top of tables when content is set.
- [#67](https://github.com/cball/justa-table/pull/67) [BUGFIX] Add additional padding to fixed-columns on windows.
- [#65](https://github.com/cball/justa-table/pull/65) [BUGFIX] Fix tables "randomly turning blank" after scrolling.
- [#64](https://github.com/cball/justa-table/pull/64) [BUGFIX] Only reflow when column count changes.
- [#63](https://github.com/cball/justa-table/pull/63) [FEATURE] Setup sticky headers on scroll, not initial load.
- [#62](https://github.com/cball/justa-table/pull/62) [FEATURE] Add `standard-table-columns-wrapper` class to non-fixed columns.
- [#58](https://github.com/cball/justa-table/pull/58) [FEATURE] Move collapsable tables to smoke and mirrors.
- [#54](https://github.com/cball/justa-table/pull/54) [BUGFIX] Ensure header heights are equal.
- [#53](https://github.com/cball/justa-table/pull/53) [BUGFIX] Only call reflow in `table-columns` if we have a `table`.
- [#52](https://github.com/cball/justa-table/pull/52) [BUGFIX] Only call destroy on floatThead if we have a table element.
- [#50](https://github.com/cball/justa-table/pull/50) [FEATURE] Add sticky headers.
- [#49](https://github.com/cball/justa-table/pull/49) [BUGFIX] Position fixed / standard columns absolute instead of float left.
- [#48](https://github.com/cball/justa-table/pull/48) [BUGFIX] Add `valueBindingPath` as a dependent key to `shouldUseFakeRowspan`.
- [#46](https://github.com/cball/justa-table/pull/46) [BUGFIX] Add `tbody` to collapsable tables.
- [#44](https://github.com/cball/justa-table/pull/44) [BUGFIX] Use `class` instead of `classNames` to the component.
- [#43](https://github.com/cball/justa-table/pull/43) [FEATURE] Add a `didRenderTable` hook which can be used to setup things like tooltips.
- [#42](https://github.com/cball/justa-table/pull/42) [FEATURE] Add ability to group items by prior row. If `useFakeRowspan` is true, gives effect of a rowspan.
- [#34](https://github.com/cball/justa-table/pull/34) [BUGFIX] Improve rendering of tables with many rows, uses smoke and mirrors. Don't allow text selection in headers.

### 0.1.0 (Feb 26, 2016)

- Initial Release
