'use strict';
var itemdef = require('./itemdef.js');
var petstore = require('./petstore.js');
var _ = require('underscore');

itemdef.defineItem({ id: 123, description: "dog brush", price: 500});
itemdef.defineItem({ id: 456, description: "catnip", price: 350});
itemdef.defineItem({ id: 789, description: "hamster ball", price: 1500});
itemdef.defineItem({ id: 1111, description: "hamster grooming", price: 100});

// utility
var printLine = function(a) { console.log(a); };

// business
var sale = petstore.summarizeSale([123,456,789,456], [{id: 1111, duration: 8}]);

var receiptContents = petstore.formatReceipt(sale);

_.forEach(receiptContents, printLine);
