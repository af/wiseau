var fs = require('fs'),
    path = require('path');

/*
 * Dependency Loaders
 *
 * Wiseau allows scripts to be loaded from multiple sources, depending on which
 * loaders are configured. Loaders should implement the following interface:
 *
 *  - loader.match(dep): Indicates whether the loader should handle a given dependency
 *  - loader.load(dep, targetConfig): Load a script, using the given Target object.
 *
 * Currently only one loader (LocalLoader) is implemented, but there are plans
 * to support http urls and npm dependencies with other loaders.
 */

// Loads script files from the local filesystem.
function LocalLoader() { }

LocalLoader.prototype = {

    // Returns a boolean indicating whether this loader should process a dependency.
    match: function(dependency_name) {
        return true;
    },

    // Return the contents of a script file from the filesystem.
    load: function(dependency_name, targetConfig) {
        var fullPath = path.resolve(targetConfig.sourceDir, dependency_name);
        try {
            var contents = fs.readFileSync(fullPath, 'utf8');
            return contents;
        }
        catch (err) {
            throw new Error('Could not find source file at ' + fullPath);
        }
    }
};


// Return an object that simply abstracts the loaders.
// Example usage (from another module):
//
// var loaders = require('./loaders').init();
// loaders.fetch('myfile.js');
function init() {
    return {
        loaders: [ new LocalLoader() ],
        fetch: function(dep_name, targetConfig) {
            var output;
            this.loaders.forEach(function(l) {
                if (!output && l.match(dep_name)) {
                    output = l.load(dep_name, targetConfig);
                }
            });
            return output;
        }
    };
}

exports.init = init;
