mimosa-less
===========

## Overview

This is a Less compiler for the Mimosa build tool.

For more information regarding Mimosa, see http://mimosa.io

## Usage

Add `'less'` to your list of modules.  That's all!  Mimosa will install the module for you when you start `mimosa watch` or `mimosa build`.

## Functionality

This module will compile Less files during `mimosa watch` and `mimosa build`.  It includes source maps by default.

## Default Config

```javascript
less: {
  lib: undefined,
  sourceMap: true,
  plugins: [],
  extensions: ["less"]
}
```

#### `lib` less node module
You may want to use this module but may not be ready to use the latest version of Less. Using the `lib` property you can provide a specific version of Less if the one being used by this module isn't to your liking. To provide a specific version, you must have it `npm install`ed into your project and then provide it to `lib`. For instance: `lib: require('less')`.

#### `sourceMap` boolean
A less compiler option to turn on/off source maps. The source maps are automatically inlined when they are present.  This module does not support separate file source maps. `sourceMap` is automatically set to `false` during `mimosa build`.

#### `plugins` array of less plugins
A less compiler option to add plugins to the render flow.  For example, you may wish to use advanced color functions with less by using the `less-plugin-advanced-color-functions` plugin.  You'll need to instantiate the plugin in your mimosa config and pass the reference into this array.

#### `extensions` array of strings
The extensions of your Less files.

## Example Config

```
var LessPluginAdvancedColorFunctions = require('less-plugin-advanced-color-functions');
var AdvancedColorFunctions = new LessPluginAdvancedColorFunctions();

...

less:
  extensions: ["less"]
  plugins: [AdvancedColorFunctions]
```

* `less.plugins` allows you to pass in an array of initialized less plugins. In this example we're loading the `less-plugin-advanced-color-functions` plugin.
