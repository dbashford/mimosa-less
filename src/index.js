"use strict";

var fs = require( 'fs' )
  , path = require( 'path' )
  , _ = require( 'lodash' )
  , logger = require( 'logmimosa' )
  , config = require( './config' )
  , importRegex = /@import\s+(?:(?:\(less\)|\(css\))\s+?)?['"](.*)['"]/g
  , getImportFilePath = function ( baseFile, importPath ) {
    return path.join( path.dirname( baseFile ), importPath );
  }
  , getExtensions = function ( mimosaConfig ) {
    return mimosaConfig.less.extensions;
  };

var compile = function ( mimosaConfig, file, done ) {
  var fileName = file.inputFileName;

  if ( logger.isDebug ) {
    logger.debug( "Compiling LESS file [[ " + fileName + " ]], first parsing..." );
  }

  var parser = new mimosaConfig.less.lib.Parser( {
    paths: [ mimosaConfig.watch.sourceDir, path.dirname( fileName ) ],
    filename: fileName
  } );

  parser.parse( file.inputFileText, function ( error, tree ) {
    var err, result;

    if ( error ) {
      return done( error, null );
    }

    try {
      logger.debug( "...then converting to CSS" );
      result = tree.toCSS();
    } catch ( ex ) {
      err = ex.type + " Error: " + ex.message;
      if ( ex.filename ) {
        err += " in '" + ex.filename + ":" + ex.line + ":" + ex.column + "'";
      }
    }

    if ( logger.isDebug ) {
      logger.debug( "Finished LESS compile for file [[ " + fileName + " ]], errors? " + !!err) ;
    }

    done( err, result );

  });
};

var determineBaseFiles = function ( allFiles ) {
  var imported = [];
  allFiles.forEach( function ( file ) {
    var imports = fs.readFileSync( file, 'utf8' ).match( importRegex );
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
  if ( logger.isDebug ) {
    logger.debug( "Base files for LESS are:\n" + baseFiles.join( '\n' ) );
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
  placeholder: config.placeholder,
  validate: config.validate
};