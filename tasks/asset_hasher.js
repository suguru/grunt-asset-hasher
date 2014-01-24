/*
 * grunt-asset-hasher
 * https://github.com/a10682/grunt-asset-hasher
 *
 * Copyright (c) 2014 Suguru Namura
 * Licensed under the MIT license.
 */

'use strict';

var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {

  var timeBase = Date.parse('2000-01-01T00:00:00Z');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('asset_hasher', 'The Grunt plugin to make filename hashed and generate file list', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    //
    var options = this.options({ });

    var prefix = options.prefix || '';
    var hashKey = options.hash_key || '';
    var list = [];

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function(filepath) {

        if (filepath.indexOf(prefix) !== 0) {
          return;
        }

        var data = grunt.file.read(filepath, { encoding: null });

        var name = filepath.substring(prefix.length);
        var sha = crypto.createHash('sha256');
        sha.update(data);
        var etag = sha.digest('hex').substr(0, 6);

        // get md5 hash name
        var md5 = crypto.createHash('md5');
        md5.update(hashKey + filepath, 'utf8');

        // get modified time
        var stat = fs.statSync(filepath);
        var time = Math.floor((stat.mtime.getTime() - timeBase) / 1000);

        var digest = md5.digest('hex');
        var outdir = digest.substring(0, 2);
        var outname = digest.substring(2);

        grunt.file.mkdir(path.join(f.dest, outdir));
        grunt.file.write(path.join(f.dest, outdir, outname), data);
        grunt.log.writeln('File "' + filepath + '" written to "' + path.join(f.dest, outdir, outname) + '"');

        list.push([filepath.substring(prefix.length), etag, time].join('\t'));
      });


      var listBuffer = new Buffer(list.join('\n'), 'utf8');

      var listOpts = options.list || {};

      if (listOpts.encrypt) {
        var listKey = new Buffer(listOpts.encrypt.secret, 'utf8');
        var algorithm = listOpts.encrypt.algorithm || 'aes128';
        var enc = crypto.createCipher(algorithm, listKey);
        var encbuf1 = enc.update(listBuffer);
        var encbuf2 = enc.final();
        listBuffer = Buffer.concat([encbuf1, encbuf2]);
        grunt.log.writeln('File list encrypted with ' + options.list.encrypt.algorithm);
      }

      var listPath = path.join(f.dest, listOpts.file || 'assets.dat');
      grunt.file.write(listPath, listBuffer);
      grunt.log.writeln('File list written to "' + listPath + '"');
    });
  });

};
