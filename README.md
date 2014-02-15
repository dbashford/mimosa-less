mimosa-less
===========

## Overview

This is a Less compiler for the Mimosa build tool. This module is for use with Mimosa `2.0+`.  This replicates the functionality of the Less compiler that was built into Mimosa before `2.0`.

For more information regarding Mimosa, see http://mimosa.io

Note: Version `1.1.0` works with Mimosa `2.0.8` and above.

## Usage

Add `'less'` to your list of modules.  That's all!  Mimosa will install the module for you when you start `mimosa watch` or `mimosa build`.

## Functionality

This module will compile Less files during `mimosa watch` and `mimosa build`.  It includes source maps by default.

## Default Config

```coffeescript
less:
  lib: undefined
  sourceMap: true
  extensions: ["less"]
```

* `lib`: You may want to use this module but may not be ready to use the latest version of Less. Using the `lib` property you can provide a specific version of Less if the one being used by this module isn't to your liking. To provide a specific version, you must have it `npm install`ed into your project and then provide it to `lib`. For instance: `lib: require('less')`.
* `sourceMap`: a less compiler option to turn on/off source maps. They are [Dynamic source maps](http://fitzgeraldnick.com/weblog/46/) which require no extra network hops to retrieve the original source or the map files. `sourceMap` is automatically set to `false` during `mimosa build`.
* `extensions`: an array of strings, the extensions of your Less files.
