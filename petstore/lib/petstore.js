'use strict';
var itemdef = require('./itemdef.js');
var _ = require('underscore');

var field = function(key) {
  return function(thing) {
    return thing[key];
  };
};

var PLUS = function(a,b) { return a + b;};

var calculateTax = function(price) {
  return Math.round(price * 0.09);
};

var definitionToLineItem = function(itemDefinition) {
  var output = {};
  output.description = itemDefinition.description;
  var sellingPrice= itemDefinition.price;
  output.sellingPrice = sellingPrice;
  output.originalPrice = itemDefinition.price;
  output.tax = calculateTax(sellingPrice);
  return output;
};

var sumField = function(things, key) {
  return _.reduce(_.map(things, field(key)), PLUS);
};

exports.summarizeSale = function(item_ids) {
  var output = {};
  var itemDefinitions = _.map(item_ids, itemdef.getDefinition);
  var lineItems = _.map(itemDefinitions, definitionToLineItem);
  var totalPrice = sumField(lineItems, 'sellingPrice');

  output.lineItems = lineItems;
  output.totalPrice = totalPrice;
  output.totalTax = sumField(lineItems, 'tax');
  return output;
};
