'use strict';

var petstore = require('../lib/petstore.js');
var itemdef = require('../lib/itemdef.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['summarizeSale'] = {
  setUp: function(done) {
    itemdef.defineItem({ id: 123, description: "dog brush", price: 500});
    itemdef.defineItem({ id: 456, description: "catnip", price: 350});
    itemdef.defineItem({ id: 789, description: "hamster ball", price: 1500});
    itemdef.defineItem({ id: 1111, description: "massage, 15 min", price: 1500, isService: true});
    done();
  },
  'line items': function(test) {
    test.expect(1);
    test.equal(petstore.summarizeSale([123,456,789]).lineItems.length, 3, 'should have 3 lines');
    test.done();
  },
  'nontaxable item': function(test) {
    test.expect(1);
    test.equal(petstore.summarizeSale([1111,456,789]).lineItems[0].tax, 0, 'should be 0 for service');
    test.done();
  },
  'tax': function(test) {
    test.expect(1);
    test.equal(petstore.summarizeSale([123,456,789]).totalTax, 212, 'should be 9% of total');
    test.done();
  },
  'total price': function(test) {
    test.expect(1);
    test.equal(petstore.summarizeSale([123,456,789]).totalPrice, 2350, 'should total the items');
    test.done();
  },
  'line item contents': function(test) {
    test.expect(4);
    var lineItem =petstore.summarizeSale([123]).lineItems[0];
    test.equal(lineItem.description, "dog brush", 'should provide description');
    test.equal(lineItem.originalPrice, 500, 'should provide original price');
    test.equal(lineItem.sellingPrice, 500, 'should provide selling price');
    test.equal(lineItem.tax, 45, 'should provide tax');
    test.done();
  },
};

exports['printReceipt'] = {
  'receipt format': function(test) {
    var summarizedSale = {
      lineItems: [
        { description: "dog brush",
          originalPrice: 500,
          sellingPrice: 500,
        },
        { description: "catnip",
          originalPrice: 350,
          sellingPrice: 350,
        }],
        totalPrice: 850,
        totalTax: 77,
    };
    var result = petstore.formatReceipt(summarizedSale);
    test.expect(4);
    test.equal(result[0], "dog brush           5.00");
    test.equal(result[1], "catnip              3.50");
    test.equal(result[2], "            tax     0.77");
    test.equal(result[3], "            total   8.50");
    test.done();
  },
};

