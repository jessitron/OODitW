'use strict';
var itemdef = require('./itemdef.js');
var _ = require('underscore');

var field = function(key) {
  return function(thing) {
    return thing[key];
  };
};

var PLUS = function(a,b) { return a + b;};

var sumProperty = function(things, key) {
  return _.reduce(_.map(things, field(key)), PLUS, 0);
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
  return pennies / 100;
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

exports.summarizeSale = function(item_ids, service_items) {
  var itemDefinitions = _.map(item_ids, itemdef.getDefinition);
  var lineItemsWithoutServices = _.map(itemDefinitions, definitionToLineItem);
  var lineItems = lineItemsWithoutServices.concat(serviceItemsToLineItems(service_items));

  var summarizedSale = {};
  summarizedSale.lineItems = lineItems;
  summarizedSale.totalPrice = sumProperty(lineItems, 'sellingPrice');
  summarizedSale.totalTax = sumProperty(lineItems, 'tax');
  return summarizedSale;
};

var formatReceiptLine = function(lineItem) {
  if (isService(lineItem)) // trial feature: service duration
  {
    return formatServiceReceiptLine(lineItem);
  }
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
