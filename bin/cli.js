#!/usr/bin/env node

// Use commander.js to set up the command line interface for Wiseau
var cli = require('commander');
var colors = require('colors');
var Wiseau = require('../lib/wiseau.js');


cli.command('init')
   .description('Create a new project')
   .action(function(cmd) {
       var options = { configFile: cli.config };
       try {
           Wiseau.create_project(options);
       }
       catch (err) {
           console.error('ERROR:'.underline.red, err.message);
           cli.verbose && console.error('\nFull stack trace:\n', err.stack);
           process.exit(1);
       }
   });

cli.command('build')
   .description('Build the output files specified by your wiseau.json file')
   .action(function(cmd) {
       var options = { configFile: cli.config };
       try {
           Wiseau.build(options);
           console.log('Done!');
       }
       catch (err) {
           console.error('ERROR:'.underline.red, err.message);
           cli.verbose && console.error('\nFull stack trace:\n', err.stack);
           process.exit(1);
       }
   });

cli.command('watch')
   .description('Watch your source directory, and re-build the project when changes are saved.')
   .action(function(cmd) {
       console.log('"wiseau watch" is not yet supported');
   });

cli.version('0.0.1')
   .option('-c, --config <path>', 'Specify your wiseau.json file manually')
   .option('-v, --verbose', 'More verbose output (including stack traces on errors)')
   .parse(process.argv);
