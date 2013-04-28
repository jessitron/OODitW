'use strict';
var _ = require('underscore');

var itemDefinitions = [];

var EMPTY_ITEM = {
  id: 0,
  description: "",
  price: 0.00,
};

exports.getDefinition = function(item_id) {
  return itemDefinitions[item_id];
};

exports.defineItem = function(item_info) {
  itemDefinitions[item_info.id] = _.extend({}, EMPTY_ITEM,item_info);
};
