'use strict';
var itemdef = require('./itemdef.js');
var _ = require('underscore');

var field = function(key) {
  return function(thing) {
    return thing[key];
  };
};

var PLUS = function(a,b) { return a + b;};

var definitionToLineItem = function(itemDefinition) {
  var output = {};
  output.description = itemDefinition.description;
  output.sellingPrice = itemDefinition.price;
  output.originalPrice = itemDefinition.price;
  return output;
};

exports.summarizeSale = function(item_ids) {
  var output = {};
  var itemDefinitions = _.map(item_ids, itemdef.getDefinition);
  output.lineItems = _.map(itemDefinitions, definitionToLineItem);

  console.log("items: %j", itemDefinitions);

  output.totalPrice = _.reduce(_.map(itemDefinitions, field('price')), PLUS);
  return output;
};
