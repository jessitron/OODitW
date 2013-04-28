
'use strict';

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
var dog_brush_price = 5.00;

exports['summarizeSale'] = {
  setUp: function(done) {
    itemdef.defineItem({ id: 123, description: "Dog brush", price: dog_brush_price});
    done();
  },
  'line items': function(test) {
    test.expect(1);
    test.equal(itemdef.getDefinition(123).price, dog_brush_price, 'should save the price');
    test.done();
  },
};
