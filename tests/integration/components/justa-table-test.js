import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('justa-table', 'Integration | Component | justa table', {
  integration: true
});

function getContainer(context) {
  return context.$(`.justa-table`);
}

function getCell(context, rowObject) {
  let { row, cell } = rowObject;
  return context.$(`tbody tr:nth-of-type(${row}) td:nth-of-type(${cell})`);
}

function getRow(context, rowObject) {
  let { row } = rowObject;
  return context.$(`tbody tr:nth-of-type(${row})`);
}

test('it renders content', function(assert) {
  let content = [
    { name: 'Fred' },
    { name: 'Wilma' },
    { name: undefined }
  ];

  this.set('content', content);

  this.render(hbs`
    {{#justa-table content=content as |table|}}
      {{#table-columns table=table as |row|}}
        {{table-column
          row=row
          headerName='foo'
          valueBindingPath='name'}}

      {{/table-columns}}
    {{/justa-table}}
  `);

  assert.equal(this.$('th').text().trim(), 'foo', 'our column was named foo');
  assert.equal(this.$('tr').length, 4, 'should have 2 rows and a header row');
  assert.equal(getCell(this, { row: 1, cell: 1 }).text().trim(), 'Fred', 'first cell should be Fred');
  assert.equal(getCell(this, { row: 2, cell: 1 }).text().trim(), 'Wilma', 'first cell should be Wilma');
});

test('adds a fake rowspan class if cell content isEmpty and useFakeRowspan is true', function(assert) {
  let content = [
    { name: 'Fred' },
    { name: 'Wilma' },
    { name: undefined }
  ];

  this.set('content', content);

  this.render(hbs`
    {{#justa-table content=content as |table|}}
      {{#table-columns table=table as |row|}}
        {{table-column
          row=row
          headerName='foo'
          useFakeRowspan=true
          valueBindingPath='name'}}

      {{/table-columns}}
    {{/justa-table}}
  `);

  assert.ok(getCell(this, { row: 3, cell: 1 }).hasClass('fake-rowspan'));
});

test('adds sticky-header class to containing div if stickyHeader is passed to justa-table as true', function(assert) {
  let content = [
    { name: 'Fred' },
    { name: 'Wilma' },
    { name: undefined }
  ];

  this.set('content', content);

  this.render(hbs`
    {{#justa-table stickyHeader=true content=content as |table|}}
      {{#table-columns  table=table as |row|}}
        {{table-column
          row=row
          headerName='foo'
          useFakeRowspan=true
          valueBindingPath='name'}}

      {{/table-columns}}
    {{/justa-table}}
  `);
  assert.ok(getContainer(this).hasClass('sticky-header'));
});

test('does not add sticky-header class to header rows if stickyHeader is passed to table-columns is not true', function(assert) {
  let content = [
    { name: 'Fred' },
    { name: 'Wilma' },
    { name: undefined }
  ];

  this.set('content', content);

  this.render(hbs`
    {{#justa-table content=content as |table|}}
      {{#table-columns table=table as |row|}}
        {{table-column
          row=row
          headerName='foo'
          useFakeRowspan=true
          valueBindingPath='name'}}

      {{/table-columns}}
    {{/justa-table}}
  `);
  assert.notOk(getContainer(this).hasClass('sticky-header'));
});

test('passes rowHeight to rows', function(assert) {
  let content = [
    { name: 'Fred' }
  ];

  this.set('content', content);

  this.render(hbs`
    {{#justa-table content=content as |table|}}
      {{#table-columns table=table rowHeight='40px' as |row|}}
        {{table-column
          row=row
          headerName='foo'
          valueBindingPath='name'}}

      {{/table-columns}}
    {{/justa-table}}
  `);

  assert.equal(getRow(this, { row: 1 }).attr('style'), '40px', 'row height should be 40px');
});

test('adds rowClasses to rows', function(assert) {
  let content = [
    { name: 'Fred' }
  ];

  this.set('content', content);

  this.render(hbs`
    {{#justa-table content=content as |table|}}
      {{#table-columns table=table rowClasses='hey man' as |row|}}
        {{table-column
          row=row
          headerName='foo'
          valueBindingPath='name'}}

      {{/table-columns}}
    {{/justa-table}}
  `);

  assert.ok(getRow(this, { row: 1 }).hasClass('hey'), 'row should have hey class');
  assert.ok(getRow(this, { row: 1 }).hasClass('man'), 'row should have man class');
});
