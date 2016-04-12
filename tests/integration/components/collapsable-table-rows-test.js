import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('collapsable-table-rows', 'Integration | Component | collapsable table rows', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{collapsable-table-rows}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#collapsable-table-rows}}
      template block text
    {{/collapsable-table-rows}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
