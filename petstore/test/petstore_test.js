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
    itemdef.defineItem({ id: 123, description: "dog brush", price: 5.00});
    itemdef.defineItem({ id: 456, description: "catnip", price: 3.50});
    itemdef.defineItem({ id: 789, description: "hamster ball", price: 15.00});
    done();
  },
  'line items': function(test) {
    test.expect(1);
    test.equal(petstore.summarizeSale([123,456,789]).lineItems.length, 3, 'should have 3 lines');
    test.done();
  },
  'total price': function(test) {
    test.expect(1);
    test.equal(petstore.summarizeSale([123,456,789]).totalPrice, 23.50, 'should total the items');
    test.done();
  },
  'line item contents': function(test) {
    test.expect(3);
    var lineItem =petstore.summarizeSale([123]).lineItems[0];
    test.equal(lineItem.description, "dog brush", 'should provide description');
    test.equal(lineItem.originalPrice, 5.00, 'should provide description');
    test.equal(lineItem.sellingPrice, 5.00, 'should provide description');
    test.done();
  },
};
