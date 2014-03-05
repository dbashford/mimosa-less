"use strict";

exports.defaults = function() {
  return {
    less: {
      sourceMap: true,
      extensions: [ "less" ]
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n" +
         "  less:                  # config settings for the Less compiler module\n" +
         "    lib: undefined       # use this property to provide a specific version of Less\n" +
         "    sourceMap: true      # a less compiler option to turn on/off source maps\n" +
         "    extensions: [\"less\"]   # default extensions for Less files\n";
};

exports.validate = function( config, validators ) {
  var errors = [];

  if ( validators.ifExistsIsObject( errors, "less config", config.less ) ) {

    if ( !config.less.lib ) {
      config.less.lib = require( "less" );
    }

    if ( validators.isArrayOfStringsMustExist( errors, "less.extensions", config.less.extensions ) ) {
      if (config.less.extensions.length === 0) {
        errors.push( "less.extensions cannot be an empty array");
      }
    }

    validators.ifExistsIsBoolean( errors, "less.sourceMap", config.less.sourceMap );

    if ( config.isBuild ) {
      config.less.sourceMap = false;
    }
  }

  return errors;
};
