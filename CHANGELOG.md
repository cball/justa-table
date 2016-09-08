# Change Log

## [v0.4.0](https://github.com/cball/justa-table/tree/v0.4.0) (2016-09-08)
[Full Changelog](https://github.com/cball/justa-table/compare/v0.3.5...v0.4.0)

- jQuery.floatHead is not found after installing and using the component [\#101](https://github.com/cball/justa-table/issues/101)

- Adds ember-release [\#108](https://github.com/cball/justa-table/pull/108) ([cball](https://github.com/cball))
- Allow canary to fail without failing all tests [\#107](https://github.com/cball/justa-table/pull/107) ([cball](https://github.com/cball))
- A11y Enhancements [\#106](https://github.com/cball/justa-table/pull/106) ([BrianSipple](https://github.com/BrianSipple))
- Implement faster unique columns function [\#105](https://github.com/cball/justa-table/pull/105) ([BrianSipple](https://github.com/BrianSipple))
- Update packages, fix tests [\#104](https://github.com/cball/justa-table/pull/104) ([cball](https://github.com/cball))
- Add default blueprint [\#100](https://github.com/cball/justa-table/pull/100) ([BrianSipple](https://github.com/BrianSipple))
- Update package.json description and keywords [\#99](https://github.com/cball/justa-table/pull/99) ([BrianSipple](https://github.com/BrianSipple))
- Ensure equal header height in next run loop [\#98](https://github.com/cball/justa-table/pull/98) ([BrianDuran](https://github.com/BrianDuran))
- Fixed 0 width when adding and removing a column on IE [\#97](https://github.com/cball/justa-table/pull/97) ([edderrd](https://github.com/edderrd))

## [v0.3.5](https://github.com/cball/justa-table/tree/v0.3.5) (2016-06-14)
[Full Changelog](https://github.com/cball/justa-table/compare/v0.3.4...v0.3.5)

- Include scroll height in calculation for table [\#96](https://github.com/cball/justa-table/pull/96) ([hbrysiewicz](https://github.com/hbrysiewicz))

## [v0.3.4](https://github.com/cball/justa-table/tree/v0.3.4) (2016-06-14)
[Full Changelog](https://github.com/cball/justa-table/compare/v0.3.3...v0.3.4)

- Update ember-try and ember-cli [\#95](https://github.com/cball/justa-table/pull/95) ([cball](https://github.com/cball))
- The repeted cells can appear as grayed out for creating a grouping appearance [\#94](https://github.com/cball/justa-table/pull/94) ([BrianDuran](https://github.com/BrianDuran))

## [v0.3.3](https://github.com/cball/justa-table/tree/v0.3.3) (2016-06-08)
[Full Changelog](https://github.com/cball/justa-table/compare/v0.3.2...v0.3.3)

- When dynamic column length, recalculate widths [\#93](https://github.com/cball/justa-table/pull/93) ([hbrysiewicz](https://github.com/hbrysiewicz))

## [v0.3.2](https://github.com/cball/justa-table/tree/v0.3.2) (2016-06-07)
[Full Changelog](https://github.com/cball/justa-table/compare/v0.3.1...v0.3.2)

- Only add height buffer if on IE [\#92](https://github.com/cball/justa-table/pull/92) ([omjrt88](https://github.com/omjrt88))

## [v0.3.1](https://github.com/cball/justa-table/tree/v0.3.1) (2016-06-01)
[Full Changelog](https://github.com/cball/justa-table/compare/v0.3.0...v0.3.1)

- Sync header height when collection changes [\#91](https://github.com/cball/justa-table/pull/91) ([hbrysiewicz](https://github.com/hbrysiewicz))
- always yield rows to show headers in collapsable table [\#85](https://github.com/cball/justa-table/pull/85) ([cpow](https://github.com/cpow))

## [v0.3.0](https://github.com/cball/justa-table/tree/v0.3.0) (2016-04-16)
[Full Changelog](https://github.com/cball/justa-table/compare/v0.2.1...v0.3.0)

- Rework hiding offscreen content [\#79](https://github.com/cball/justa-table/pull/79) ([cball](https://github.com/cball))
- 0.2.1 [\#75](https://github.com/cball/justa-table/pull/75) ([cball](https://github.com/cball))

## [v0.2.1](https://github.com/cball/justa-table/tree/v0.2.1) (2016-04-06)
[Full Changelog](https://github.com/cball/justa-table/compare/v0.2.0...v0.2.1)

- Only add scrollbar height to tables if needed [\#74](https://github.com/cball/justa-table/pull/74) ([cball](https://github.com/cball))

## [v0.2.0](https://github.com/cball/justa-table/tree/v0.2.0) (2016-04-06)
[Full Changelog](https://github.com/cball/justa-table/compare/v0.1.0...v0.2.0)

- Add unique class to non-fixed columns [\#59](https://github.com/cball/justa-table/issues/59)
- Add smoke and mirrors to collapsable tables [\#56](https://github.com/cball/justa-table/issues/56)
- Add option for sticky headers [\#39](https://github.com/cball/justa-table/issues/39)
- Add table property to table-column [\#38](https://github.com/cball/justa-table/issues/38)
- Add groupWithPriorRow option to `table-column` to avoid repeated cells [\#36](https://github.com/cball/justa-table/issues/36)
- Leverage didMountCollection event on vertical-item if need to re-initialize things like popovers? [\#35](https://github.com/cball/justa-table/issues/35)
- Set non-viewport rows/columns to be visibility hidden \(to avoid browser repaint\) [\#18](https://github.com/cball/justa-table/issues/18)

- extract collapsable table code to {{justa-collapsable-table}} [\#22](https://github.com/cball/justa-table/issues/22)

- Add CHANGELOG [\#73](https://github.com/cball/justa-table/pull/73) ([cball](https://github.com/cball))
- Re-enable auto height change [\#72](https://github.com/cball/justa-table/pull/72) ([cball](https://github.com/cball))
- Ensure that table reflow happens when the header rerenders [\#71](https://github.com/cball/justa-table/pull/71) ([myared](https://github.com/myared))
- Scroll to the top after setting content [\#70](https://github.com/cball/justa-table/pull/70) ([rbeene](https://github.com/rbeene))
- Adds a windows class if on windows to account for differences in scrollbar heights [\#68](https://github.com/cball/justa-table/pull/68) ([cball](https://github.com/cball))
- Adds an additional div that gets bottom padding [\#67](https://github.com/cball/justa-table/pull/67) ([cball](https://github.com/cball))
- Fix tables randomly "turning blank" after scrolling [\#65](https://github.com/cball/justa-table/pull/65) ([cball](https://github.com/cball))
- Only reflow headers on column change. [\#64](https://github.com/cball/justa-table/pull/64) ([cball](https://github.com/cball))
- Setup sticky headers on scroll. Scope hover to .table-row elements. [\#63](https://github.com/cball/justa-table/pull/63) ([cball](https://github.com/cball))
- Add standard-table-columns-wrapper class to standard columns. [\#62](https://github.com/cball/justa-table/pull/62) ([cball](https://github.com/cball))
- disable height resize [\#61](https://github.com/cball/justa-table/pull/61) ([theworkerant](https://github.com/theworkerant))
- Move collapsable tables to smoke-and-mirrors [\#58](https://github.com/cball/justa-table/pull/58) ([cball](https://github.com/cball))
- trigger sticky header reflow when header attrs change [\#57](https://github.com/cball/justa-table/pull/57) ([theworkerant](https://github.com/theworkerant))
- change default styles a bit. [\#55](https://github.com/cball/justa-table/pull/55) ([cball](https://github.com/cball))
- Ensure headers are equal [\#54](https://github.com/cball/justa-table/pull/54) ([cball](https://github.com/cball))
- Don't call reflow unless we have a table. [\#53](https://github.com/cball/justa-table/pull/53) ([cball](https://github.com/cball))
- Ensure there is a table element before trying to destroy floatThead. [\#52](https://github.com/cball/justa-table/pull/52) ([cball](https://github.com/cball))
- Add Sticky Headers [\#50](https://github.com/cball/justa-table/pull/50) ([cball](https://github.com/cball))
- Rework fixed columns [\#49](https://github.com/cball/justa-table/pull/49) ([cball](https://github.com/cball))
- Adds valueBindingPath as dependent key to shouldUseFakeRowspan [\#48](https://github.com/cball/justa-table/pull/48) ([cball](https://github.com/cball))
- Dynamically change height of tables after render [\#47](https://github.com/cball/justa-table/pull/47) ([cball](https://github.com/cball))
- add tbody to collapsible tables [\#46](https://github.com/cball/justa-table/pull/46) ([theworkerant](https://github.com/theworkerant))
- change classNames to class for header components [\#44](https://github.com/cball/justa-table/pull/44) ([cball](https://github.com/cball))
- Add didRenderTable hook [\#43](https://github.com/cball/justa-table/pull/43) ([cball](https://github.com/cball))
- Add ability to group rows by prior row. [\#42](https://github.com/cball/justa-table/pull/42) ([cball](https://github.com/cball))
- Improve performance with large tables [\#34](https://github.com/cball/justa-table/pull/34) ([cball](https://github.com/cball))

## [v0.1.0](https://github.com/cball/justa-table/tree/v0.1.0) (2016-02-26)
- Allow `data` property for collapsable tables to be configurable [\#21](https://github.com/cball/justa-table/issues/21)
- add colgroup columns [\#13](https://github.com/cball/justa-table/issues/13)
- trigger event on hover of row [\#10](https://github.com/cball/justa-table/issues/10)
- all non required styles should be opt in [\#9](https://github.com/cball/justa-table/issues/9)

- If title is an empty string, the default title tooltip is shown [\#32](https://github.com/cball/justa-table/issues/32)
- Bump jquery to avoid failed CI builds [\#24](https://github.com/cball/justa-table/issues/24)
- Fixed column table: header height needs to match normal column header height [\#8](https://github.com/cball/justa-table/issues/8)

- Issue adding specified index columns [\#6](https://github.com/cball/justa-table/issues/6)
- Before this is actually ready, implement the following with examples: [\#1](https://github.com/cball/justa-table/issues/1)

- Fix a bug where title would not be respected if it was an empty string [\#33](https://github.com/cball/justa-table/pull/33) ([cball](https://github.com/cball))
- Refactor an each/else to an if/each/else to work around an Ember bug [\#31](https://github.com/cball/justa-table/pull/31) ([pgengler](https://github.com/pgengler))
- Require on-load-more-rows to return a Promise [\#29](https://github.com/cball/justa-table/pull/29) ([rbeene](https://github.com/rbeene))
- table-row-class-added: Fixing table row when is on mouse hover [\#28](https://github.com/cball/justa-table/pull/28) ([omjrt88](https://github.com/omjrt88))
- Add the title attribute to the 'td' table column tag [\#27](https://github.com/cball/justa-table/pull/27) ([mesparza](https://github.com/mesparza))
- bump jQuery to 2.1.4 [\#25](https://github.com/cball/justa-table/pull/25) ([cball](https://github.com/cball))
- Add row-group-data property [\#23](https://github.com/cball/justa-table/pull/23) ([ignacio753](https://github.com/ignacio753))
- Breakout CSS and change it to be opt-in [\#20](https://github.com/cball/justa-table/pull/20) ([pgrippi](https://github.com/pgrippi))
- Adds infinite pagination support via ember-in-viewport [\#19](https://github.com/cball/justa-table/pull/19) ([cball](https://github.com/cball))
- Add column.headerClassNames to header component. [\#17](https://github.com/cball/justa-table/pull/17) ([cball](https://github.com/cball))
- Add table-row class to all rows [\#16](https://github.com/cball/justa-table/pull/16) ([cball](https://github.com/cball))
- Fixed column fixes, add textWrap, collapsable fixes [\#15](https://github.com/cball/justa-table/pull/15) ([cball](https://github.com/cball))
- Dynamically set dependent keys for \_value on init. [\#14](https://github.com/cball/justa-table/pull/14) ([cball](https://github.com/cball))
- Some fixes [\#12](https://github.com/cball/justa-table/pull/12) ([cball](https://github.com/cball))
- Dynamic row/column fixes. [\#7](https://github.com/cball/justa-table/pull/7) ([cball](https://github.com/cball))
- Fixed columns, resizable columns, revamped dummy app [\#4](https://github.com/cball/justa-table/pull/4) ([pgrippi](https://github.com/pgrippi))
- Properly register and remove columns [\#3](https://github.com/cball/justa-table/pull/3) ([cball](https://github.com/cball))
- Remove ember-composable, explicitly pass in parent table to columns. [\#2](https://github.com/cball/justa-table/pull/2) ([cball](https://github.com/cball))



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*