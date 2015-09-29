import Ember from 'ember';
import layout from '../templates/components/table-columns';
import TableColumns from './table-columns';

export default TableColumns.extend({
  layout: layout,

  init() {
    this._super(...arguments);
    this.classNames = ['fixed-table-columns'];
  }
});
