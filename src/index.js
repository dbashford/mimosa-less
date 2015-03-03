"use strict";

var fs = require( "fs" )
  , path = require( "path" )
  , _ = require( "lodash" )
  , logger = null
  , config = require( "./config" )
  , importRegex =
    /@import\s+(?:(?:\(less\)|\(css\)|\(inline\)|\(reference\)|\(once\)|\(multiple\)|\(optional\))\s+?)?['"](.*)['"]/g
  , getImportFilePath = function ( baseFile, importPath ) {
    return path.join( path.dirname( baseFile ), importPath );
  }
  , getExtensions = function ( mimosaConfig ) {
    logger = mimosaConfig.log;
    return mimosaConfig.less.extensions;
  };

var compile = function ( mimosaConfig, file, done ) {
  var fileName = file.inputFileName;

  var options = {
    paths: [ mimosaConfig.watch.sourceDir, path.dirname( fileName ) ],
    filename: fileName,
    plugins: mimosaConfig.less.plugins
  };

  if ( mimosaConfig.less.sourceMap ) {
    options.sourceMap = {
      sourceMapFileInline: true,
      outputSourceFiles: true
    };
  }

  mimosaConfig.less.lib.render(file.inputFileText, options, function(e, output) {
    if ( e ) {
      var err = e.type + " Error: " + e.message;
      if ( e.filename ) {
        err += " in '" + e.filename + ":" + e.line + ":" + e.column + "'";
      }
      return done( err, null );
    } else {
      return done( null, output.css );
    }
  });
};

var determineBaseFiles = function ( allFiles ) {
  var imported = [];
  allFiles.forEach( function ( file ) {
    var imports = fs.readFileSync( file, "utf8" ).match( importRegex );
    if ( !imports ) {
      return;
    }

    imports.forEach( function ( anImport ) {
      importRegex.lastIndex = 0;
      var importPath = importRegex.exec( anImport )[1];
      var fullImportPath = path.join( path.dirname( file ), importPath );
      allFiles.some( function( fullFilePath ) {

        // if import uses extension
        if ( fullFilePath === ( fullImportPath ) ) {
          return true;
        }

        // if import does not use extension
        if ( fullFilePath.indexOf( fullImportPath ) === 0 ) {
          fullImportPath += path.extname( fullFilePath );
          return true;
        }
      });
      imported.push( fullImportPath );
    });

  });

  var baseFiles = _.difference( allFiles, imported );
  if ( logger.isDebug() ) {
    logger.debug( "Base files for LESS are:\n" + baseFiles.join( "\n" ) );
  }
  return baseFiles;
};

module.exports = {
  name: "less",
  compilerType: "css",
  canFullyImportCSS: true,
  importRegex: importRegex,
  compile: compile,
  determineBaseFiles: determineBaseFiles,
  getImportFilePath: getImportFilePath,
  extensions: getExtensions,
  defaults: config.defaults,
  validate: config.validate
};
