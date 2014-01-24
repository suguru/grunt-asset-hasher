'use strict';

var grunt = require('grunt');

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

exports.asset_hasher = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  hasher: function(test) {

    test.ok(grunt.file.exists('tmp/assets.dat'));
    test.ok(grunt.file.exists('tmp/28/54557e2d60ea0b6bf3460719edb32e'));
    test.ok(grunt.file.exists('tmp/26/f06fb2a3789dee933ec23f7bf6e64b'));

    var crypto = require('crypto');
    var data = grunt.file.read('tmp/assets.dat', { encoding: null });

    var aes = crypto.createDecipher('aes128', new Buffer('secret', 'utf8'));
    var buf1 = aes.update(data);
    var buf2 = aes.final();
    var text = Buffer.concat([buf1, buf2]).toString('utf8');

    var lines = text.split('\n');

    test.equal(lines.length, 2);

    var line1 = lines[0].split('\t');
    var line2 = lines[0].split('\t');

    test.equal(line1[0], '123');
    test.equal(typeof line1[1], 'string');
    test.equal(line1[1].length, 6);
    test.ok(line1[2].match(/^[0-9]+$/));

    test.equal(line2[0], '123');
    test.equal(typeof line2[1], 'string');
    test.equal(line2[1].length, 6);
    test.ok(line2[2].match(/^[0-9]+$/));

    test.done();
  },
};
