'use strict';
var itemdef = require('./itemdef.js');
var _ = require('underscore');
var sp = require('sprintf-js');

var field = function(key) {
  return function(thing) {
    return thing[key];
  };
};

var PLUS = function(a,b) { return a + b;};

var sumProperty = function(things, key) {
  return _.reduce(_.map(things, field(key)), PLUS);
};

// business-relevant methods

var calculateTax = function(price) {
  return Math.round(price * 0.09);
};

var definitionToLineItem = function(itemDefinition) {
  var sellingPrice= itemDefinition.price;

  var output = {};
  output.description = itemDefinition.description;
  output.sellingPrice = sellingPrice;
  output.originalPrice = itemDefinition.price;
  output.tax = calculateTax(sellingPrice);
  return output;
};

var formatMoney = function(pennies) {
  return sp.sprintf("%.2f", (pennies / 100));
};


// trial feature: service duration
var singleServiceToLineItem = function(serviceItem) {
  var itemDefinition = itemdef.getDefinition(serviceItem.id);
  var output = {};
  output.description = itemDefinition.description;
  output.sellingPrice= itemDefinition.price * serviceItem.duration;
  output.originalPrice = itemDefinition.price;
  output.duration = serviceItem.duration;
  output.tax = 0;
  return output;
};

var serviceItemsToLineItems = function(serviceItems) {
  return _.map(serviceItems, singleServiceToLineItem);
};

var isService = function(lineItem) {
  return lineItem.duration !== undefined;
};

var formatServiceReceiptLine = function(lineItem) {
  return lineItem.description + " " + lineItem.duration + "m    " + formatMoney(lineItem.sellingPrice);
};

// public API

exports.summarizeSale = function(itemIds) {
  var itemDefinitions = _.map(itemIds, itemdef.getDefinition);
  var lineItems = _.map(itemDefinitions, definitionToLineItem);

  var summarizedSale = {};
  summarizedSale.lineItems = lineItems;
  summarizedSale.totalPrice = sumProperty(lineItems, 'sellingPrice');
  summarizedSale.totalTax = sumProperty(lineItems, 'tax');
  return summarizedSale;
};

var formatMoney = function(pennies) {
  return pennies / 100;
};

var formatReceiptLine = function(lineItem) {
  if (isService(lineItem)) // trial feature: service duration
  {
    return formatServiceReceiptLine(lineItem);
  }
  return sp.sprintf("%-13s%6s", lineItem.description, formatMoney(lineItem.sellingPrice));
};

exports.formatReceipt = function(summarizedSale) {
  var itemLines = _.map(summarizedSale.lineItems, formatReceiptLine);
  var taxLine   = "         tax   " + formatMoney(summarizedSale.totalTax);
  var totalLine = "         total " + formatMoney(summarizedSale.totalPrice);

  return itemLines.concat(taxLine, totalLine);
};
