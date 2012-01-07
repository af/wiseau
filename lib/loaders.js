var fs = require('fs'),
    path = require('path');



// Loads script files from the local filesystem.
function LocalLoader(configObj) {
    this.config = configObj;
}

LocalLoader.prototype.match = function(dependency_name) {
    return true;
}

// Return the contents of a script file from the filesystem.
LocalLoader.prototype.load = function(dependency_name, targetConfig) {
    targetConfig = targetConfig || {};
    var sourceDir = targetConfig.sourceDir || this.config.getSourceDir();
    var fullPath = path.resolve(sourceDir, dependency_name);

    try {
        var contents = fs.readFileSync(fullPath, 'utf8');
        return contents;
    }
    catch (err) {
        throw new Error('Could not find source file at ' + fullPath);
    }
}


// Return an object that simply abstracts the loaders.
// Takes a BuildConfig object as its only parameter.
//
// Example usage (from another module):
//
// var loaders = require('./loaders').init(config_object);
// loaders.get('myfile.js');
function init(configObj) {
    return {
        loaders: [ new LocalLoader(configObj) ],
        fetch: function(dep_name) {
            var output;
            this.loaders.forEach(function(l) {
                if (!output && l.match(dep_name)) {
                    output = l.load(dep_name, configObj);
                }
            });
            return output;
        }
    };
}

exports.init = init;
