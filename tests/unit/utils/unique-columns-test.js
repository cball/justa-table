import uniqBy from 'justa-table/utils/unique-by';
import { module, test } from 'qunit';

const ITEMS = [
  { city: 'New York', country: 'United States' },
  { city: 'Boston', country: 'United States' },
  { city: 'London', country: 'England' },
  { city: 'Paris', country: 'France' },
  { city: 'Moscow', country: 'Russia' },
  { city: 'St. Petersburg', country: 'Russia' },
  { city: 'St. Petersburg', country: 'United States' },
  { city: 'Rome', country: 'Italy' }
];

const UNIQUE_BY_CITY = [
  ITEMS[0],
  ITEMS[1],
  ITEMS[2],
  ITEMS[3],
  ITEMS[4],
  ITEMS[5],
  ITEMS[7]
];

const UNIQUE_BY_COUNTRY = [
  ITEMS[0],
  ITEMS[2],
  ITEMS[3],
  ITEMS[4],
  ITEMS[7]
];

let actual, expected;

module('Unit | Utility | unique-by');

// Replace this with your real tests.
test('finding the unique object in a list according to a given property', function(assert) {
  expected = UNIQUE_BY_CITY;
  actual = uniqBy(ITEMS, 'city');

  assert.deepEqual(actual, expected);

  expected = UNIQUE_BY_COUNTRY;
  actual = uniqBy(ITEMS, 'country');

  assert.deepEqual(actual, expected);
});
