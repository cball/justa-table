import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('justa-table', 'Integration | Component | justa table', {
  integration: true
});

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

  return wait().then(() => {
    assert.equal(this.$('th').text().trim(), 'foo', 'our column was named foo');
    assert.equal(this.$('tr').length, 4, 'should have 2 rows and a header row');
    assert.equal(getCell(this, { row: 1, cell: 1 }).text().trim(), 'Fred', 'first cell should be Fred');
    assert.equal(getCell(this, { row: 2, cell: 1 }).text().trim(), 'Wilma', 'first cell should be Wilma');
  });

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

  return wait().then(() => {
    assert.ok(getCell(this, { row: 3, cell: 1 }).hasClass('fake-rowspan'));
  });
});

test('Places null value in a row if groupWithPriorRow is true and the prior record has the same value', function(assert) {
  let content = [{
      director: 'Quentin Tarantino',
      movie: 'Pulp Fiction'
    },
    {
      director: 'Quentin Tarantino',
      movie: 'Reservoir Dogs'
    },
    {
      director: 'JJ Abrams',
      movie: 'Star Wars Episode VII'
    },
    {
      director: 'Christopher Nolan',
      movie: 'Dark Knight Rises'
    }
  ];
  this.set('content', content);

  this.render(hbs`
    {{#justa-table content=content as |table|}}
      {{#table-columns table=table as |row|}}
        {{table-column
          row=row
          headerName='director'
          groupWithPriorRow=true
          useFakeRowspan=true
          valueBindingPath='director'}}
        {{table-column
          row=row
          headerName='movie'
          useFakeRowspan=true
          valueBindingPath='movie'}}
      {{/table-columns}}
    {{/justa-table}}
  `);

  return wait().then(() => {
    assert.equal(getCell(this, { row: 1, cell: 1 }).text().trim(), 'Quentin Tarantino', 'first cell should be Quentin Tarantino');
    assert.equal(getCell(this, { row: 2, cell: 1 }).text().trim(), '', 'second row first cell should be empty');
    assert.equal(getCell(this, { row: 3, cell: 1 }).text().trim(), 'JJ Abrams', 'third row first cell should be JJ Abrams');
  });

});

test('passes rowHeight to rows', function(assert) {
  let content = [
    { name: 'Fred' }
  ];

  this.set('content', content);

  this.render(hbs`
    {{#justa-table content=content rowHeight='40px' as |table|}}
      {{#table-columns table=table as |row|}}
        {{table-column
          row=row
          headerName='foo'
          valueBindingPath='name'}}

      {{/table-columns}}
    {{/justa-table}}
  `);

  return wait().then(() => {
    assert.equal(getRow(this, { row: 1 }).attr('style').trim(), 'height: 40px;', 'row height should be 40px');
  });
});

test('adds rowClasses to rows', function(assert) {
  let content = [
    { name: 'Fred' }
  ];

  this.set('content', content);

  this.render(hbs`
    {{#justa-table content=content rowHeight='40px' as |table|}}
      {{#table-columns table=table rowClasses='hey man' as |row|}}
        {{table-column
          row=row
          headerName='foo'
          valueBindingPath='name'}}

      {{/table-columns}}
    {{/justa-table}}
  `);

  return wait().then(() => {
    assert.ok(getRow(this, { row: 1 }).hasClass('hey'), 'row should have hey class');
    assert.ok(getRow(this, { row: 1 }).hasClass('man'), 'row should have man class');
    assert.ok(getRow(this, { row: 1 }).hasClass('table-row'), 'row should have default row class');
  });
});

test('title attribute defaults to value', function(assert) {
  let content = [
    { name: 'Fred' }
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

  return wait().then(() => {
    assert.equal(this.$('td[title="Fred"]').length, 1, 'title attribute should default to value');
  });
});

test('title attribute can be customized', function(assert) {
  let content = [
    { name: 'Fred' }
  ];

  this.set('content', content);

  this.render(hbs`
    {{#justa-table content=content as |table|}}
      {{#table-columns table=table as |row|}}
        {{table-column
          row=row
          title='whoa'
          headerName='foo'
          valueBindingPath='name'}}

      {{/table-columns}}
    {{/justa-table}}
  `);

  return wait().then(() => {
    assert.equal(this.$('td[title="whoa"]').length, 1, 'title attribute should be whoa');
  });
});

test('title attribute can be customized', function(assert) {
  let content = [
    {
      person: {
        name: 'fred'
      }
    }
  ];

  this.set('content', content);

  this.render(hbs`
    {{#justa-table content=content as |table|}}
      {{#table-columns table=table as |row|}}
        {{table-column
          row=row
          title=''
          headerName='foo'
          valueBindingPath='person'}}

      {{/table-columns}}
    {{/justa-table}}
  `);

  return wait().then(() => {
    assert.equal(this.$('td[title=""]').length, 1, 'title attribute should be empty string');
  });
});

test('title attribute returns blank if invalid valueBindingPath', function(assert) {
  let content = [
    {
      person: {
        name: 'fred'
      }
    }
  ];

  this.set('content', content);

  this.render(hbs`
    {{#justa-table content=content as |table|}}
      {{#table-columns table=table as |row|}}
        {{table-column
          row=row
          headerName='foo'
          valueBindingPath='asdf'}}

      {{/table-columns}}
    {{/justa-table}}
  `);

  return wait().then(() => {
    assert.equal(this.$('td[title=""]').length, 1, 'title attribute should be empty string');
  });
});
