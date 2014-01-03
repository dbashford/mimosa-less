"use strict";

exports.defaults = function() {
  return {
    less: {
      extensions: [ "less" ],
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n"+
         "  # less:                  # config settings for the Less compiler module\n" +
         "    # lib: undefined       # use this property to provide a specific version of Less\n" +
         "    # extensions: [\"less\"]   # default extensions for Less files\n";
};

exports.validate = function( config, validators ) {
  var errors = [];

  if ( validators.ifExistsIsObject( errors, "less config", config.less ) ) {

    if ( !config.less.lib ) {
      config.less.lib = require( 'less' );
    }

    if ( validators.isArrayOfStringsMustExist( errors, "less.extensions", config.less.extensions ) ) {
      if (config.less.extensions.length === 0) {
        errors.push( "less.extensions cannot be an empty array");
      }
    }
  }

  return errors;
};



