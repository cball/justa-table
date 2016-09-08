import Ember from 'ember';

const {
  A,
  isArray,
  get,
  guidFor
} = Ember;

/**
 * Helper for a list of objects that computes unique objects by a 'propertyKey'
 */
function uniqueBy(items, propertyKey) {
  const uniques = A();
  const seen = Object.create(null);

  if (isArray(items)) {
    items.forEach(item => {
      const guid = guidFor(get(item, propertyKey));

      if (!(guid in seen)) {
        seen[guid] = true;
        uniques.push(item);
      }
    });
  }

  return uniques;
}

export default uniqueBy;
