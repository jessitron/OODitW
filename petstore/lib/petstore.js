'use strict';
var itemdef = require('./itemdef.js');
var _ = require('underscore');

var field = function(key) {
  return function(thing) {
    return thing[key];
  };
};

var PLUS = function(a,b) { return a + b;};

var sumField = function(things, key) {
  return _.reduce(_.map(things, field(key)), PLUS);
};

// business-relevant methods

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

// public API

exports.summarizeSale = function(item_ids) {
  var itemDefinitions = _.map(item_ids, itemdef.getDefinition);
  var lineItems = _.map(itemDefinitions, definitionToLineItem);
  var totalPrice = sumField(lineItems, 'sellingPrice');

  var summarizedSale = {};
  summarizedSale.lineItems = lineItems;
  summarizedSale.totalPrice = totalPrice;
  summarizedSale.totalTax = sumField(lineItems, 'tax');
  return summarizedSale;
};

var formatMoney = function(pennies) {
  return pennies / 100;
};

var formatReceiptLine = function(lineItem) {
  return lineItem.description + "      " + formatMoney(lineItem.sellingPrice);
};

exports.formatReceipt = function(summarizedSale) {
  //var width = 19;
  // TODO: make this work when I have google
  var itemLines = _.map(summarizedSale.lineItems, formatReceiptLine);
  var taxLine   = "         tax   " + formatMoney(summarizedSale.totalTax);
  var totalLine = "         total " + formatMoney(summarizedSale.totalPrice);

  return itemLines.concat(taxLine, totalLine);
};
