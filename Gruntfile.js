/*
 * grunt-asset-hasher
 * https://github.com/a10682/grunt-asset-hasher
 *
 * Copyright (c) 2014 Suguru Namura
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    asset_hasher: {
      options: {
      },
      basic: {
        options: {
          prefix: 'test/fixtures/',
          hash_key: 'hashing',
          list: {
            file: 'assets.dat'
          }
        },
        files: {
          'tmp/basic': 'test/fixtures/**/*'
        }
      },
      encrypt: {
        options: {
          prefix: 'test/fixtures/',
          hash_key: 'hashing',
          list: {
            file: 'assets.dat',
            encrypt: {
              algorithm: 'aes-128-ecb',
              secret: 'secret'
            }
          }
        },
        files: {
          'tmp/encrypt': 'test/fixtures/**/*'
        }
      },
      encrypt_md5: {
        options: {
          prefix: 'test/fixtures/',
          hash_key: 'hashing',
          list: {
            file: 'assets.dat',
            encrypt: {
              algorithm: 'aes-128-cbc',
              iv: 'initialization_vector',
              secret: 'secret',
              md5: true
            }
          }
        },
        files: {
          'tmp/encrypt_md5': 'test/fixtures/**/*'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'asset_hasher:basic', 'asset_hasher:encrypt', 'asset_hasher:encrypt_md5', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
