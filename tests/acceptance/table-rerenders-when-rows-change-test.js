import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';
import $ from 'jquery';

module('Acceptance | table rerenders when rows change', {
  beforeEach() {
    this.application = startApp();
  },

  afterEach() {
    Ember.run(this.application, 'destroy');
  }
});

test('basic table properly re-renders when rows are removed', function(assert) {
  visit('/examples/basic-table');

  andThen(() => {
    let rows = $('.table-columns tr').length;
    let headers = $('.table-columns th').text().trim();

    assert.equal(rows, 51, 'should have 50 rows + header');
    assert.ok(headers.match(/name/i), 'should have name header');
    assert.ok(headers.match(/image/i), 'should have image header');
  });

  click('a:contains(Remove some rows)');

  andThen(() => {
    let rows = $('.table-columns tr').length;
    let headers = $('.table-columns th').text().trim();

    assert.equal(rows, 46, 'should have 45 rows + header');
    assert.ok(headers.match(/name/i), 'still have name header');
    assert.ok(headers.match(/image/i), 'still have image header');
  });
});

test('basic table properly re-renders when columns are removed', function(assert) {
  visit('/examples/basic-table');

  andThen(() => {
    let headerCount = $('.table-columns th').length;
    let firstRowCellCount = $('.table-columns tr:nth-of-type(2) td').length;
    assert.equal(headerCount, 4);
    assert.equal(firstRowCellCount, 4);
  });

  click('a:contains(Remove a dynamic column)');

  andThen(() => {
    let headerCount = $('.table-columns th').length;
    let firstRowCellCount = $('.table-columns tr:nth-of-type(2) td').length;
    assert.equal(headerCount, 3);
    assert.equal(firstRowCellCount, 3);
  });
});

test('basic table properly re-renders when columns are inserted', function(assert) {
  visit('/examples/basic-table');

  andThen(() => {
    assert.deepEqual(headerNames(), ['Name', 'Image', 'Dynamic 1', 'Dynamic 2']);
  });

  click('a:contains(Insert some columns)');

  andThen(() => {
    assert.deepEqual(headerNames(), ['Name', 'Image', 'Dynamic 1', 'New Dynamic 1', 'Dynamic 2', 'New Dynamic 2']);
  });
});

function headerNames() {
  return $('.table-columns th').map(function() {
    return $(this).text().trim();
  }).toArray();
}
