# grunt-asset-hasher

> The Grunt plugin to make filename hashed and generate file list.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-asset-hasher --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-asset-hasher');
```

## The "asset_hasher" task

### Overview

In your project's Gruntfile, add a section named `asset_hasher` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  asset_hasher: {
    your_target: {
      prefix: 'src/contents/',
      hash_key: 'hashing_prefix_key'
      files: {
        'out', 'src/contents/**/*'
      }
    }
  },
});
```

### Options

#### options.prefix
Type: `String`
Default value: ``

A string value that is used to omit from file path in list file to be written

#### options.hash_key

Type: `String`
Default value: ``

A string value that is used to prefix key of hashing of file path

#### options.list

Type: `Object`

A object value that represents options of list file to be written

#### options.list.file

Type: 'String`
Default value: `assets.dat`

#### options.list.encrypt

Type: `Object`
Default value: `null`

A options of encrypting lsit file. It will not encrypt if this option does not exist

#### options.list.encrypt.algorithm

Type: `string`,
Default value: `aes128`

An algorithm of encryption of list file

#### options.list.encrypt.secret

Type: `string`,
Default value: `secret`

A secret key of encryption

### Usage Examples

#### File name hasing and encrypting list file

```js
grunt.initConfig({
  asset_hasher: {
    hashing: {
      options: {
        prefix: 'test/fixtures/',
        hash_key: 'hashing',
        list: {
          file: 'assets.dat',
          encrypt: {
            algorithm: 'aes128',
            secret: 'secret',
            md5: true // Use MD5 digest of secret if true
          }
        }
      },
      files: {
        'tmp/': 'test/fixtures/**/*'
      }
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
