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

    test.ok(grunt.file.exists('tmp/basic/assets.dat'));
    test.ok(grunt.file.exists('tmp/basic/25/7d865fa11537f90e27fbfd32ade9b2'));
    test.ok(grunt.file.exists('tmp/basic/6b/40ddcf83856e62cfbfc59377631277'));

    test.ok(grunt.file.exists('tmp/encrypt/assets.dat'));
    test.ok(grunt.file.exists('tmp/encrypt/25/7d865fa11537f90e27fbfd32ade9b2'));
    test.ok(grunt.file.exists('tmp/encrypt/6b/40ddcf83856e62cfbfc59377631277'));

    test.ok(grunt.file.exists('tmp/encrypt_md5/assets.dat'));
    test.ok(grunt.file.exists('tmp/encrypt_md5/25/7d865fa11537f90e27fbfd32ade9b2'));
    test.ok(grunt.file.exists('tmp/encrypt_md5/6b/40ddcf83856e62cfbfc59377631277'));

    var testAsset = function(text) {
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
    };

    // basic
    var text = grunt.file.read('tmp/basic/assets.dat', { encoding: 'utf8' });
    testAsset(text);

    // encrypt
    var crypto = require('crypto');
    var data = grunt.file.read('tmp/encrypt/assets.dat', { encoding: null });

    var aes = crypto.createDecipher('aes-128-ecb', new Buffer('secret', 'utf8'));
    var buf1 = aes.update(data);
    var buf2 = aes.final();
    text = Buffer.concat([buf1, buf2]).toString('utf8');
    testAsset(text);

    // encrypt_md5 with iv
    data = grunt.file.read('tmp/encrypt_md5/assets.dat', { encoding: null });
    var md5 = crypto.createHash('md5');
    md5.update('secret', 'utf8');
    var secret = md5.digest();

    md5 = crypto.createHash('md5');
    md5.update('initialization_vector', 'utf8');
    var iv = md5.digest();

    aes = crypto.createDecipheriv('aes-128-cbc', secret, iv);
    buf1 = aes.update(data);
    buf2 = aes.final();
    text = Buffer.concat([buf1, buf2]).toString('utf8');
    testAsset(text);

    test.done();
  },
};
