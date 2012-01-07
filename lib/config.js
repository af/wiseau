var fs = require('fs'),
    path = require('path');

// Default config values:
var defaults = {
    "sourceDir": "js/src",
    "outputDir": "js/build",
    "minify": true,
    "lint": false,

    "targets": {}
};

// Path to the default config file to use when starting a new project:
var initialConfigPath = path.resolve(__dirname, 'initial_config.json');


// Helper function to strip single-line comments ("//") from a multi-line string.
function stripComments(data) {
    var lines = data.split('\n'),
        output = [];
    lines.forEach(function(line) {
        output.push(line.replace(/(^|[\s])\/\/.*/, '$1'));
    });
    return output.join('\n');
}


function getConfigPath(options) {
    var defaultName = 'clientbuild.json',
        configPath = options.configFile || defaultName,
        fullPath = path.normalize(path.join(process.env.PWD, configPath));
    return fullPath;
}


// Given an options object from the CLI parser, return the parsed configuration
// object for the project.
function parseConfig(configPath) {
    var data, configObj;
    try {
        data = fs.readFileSync(configPath, 'utf8');

        // Strip single-line comments out from the json file:
        data = stripComments(data);
        configObj = JSON.parse(data);
    }
    catch (err) {
        console.error('Could not load config!');
        return null;
    }

    // Fill in default values for any keys not in the parsed config:
    for (var k in defaults) {
        if (configObj[k] === undefined) {
            configObj[k] = defaults[k];
        }
    }
    return configObj;
}

// Create a new config file at the given path
// Returns the data from the parsed config file.
function createFile(configPath) {
    var contents = fs.readFileSync(initialConfigPath, 'utf8');

    // Ensure that we don't overwrite an existing file:
    if (path.existsSync(configPath)) {
        console.error('Config file already exists at', configPath);
        contents = fs.readFileSync(configPath, 'utf8');
    }
    else {
        var err = fs.writeFileSync(configPath, contents);
        if (err) { throw err; }
        else {
            console.log('Created a new Wiseau project file at', configPath);
        }
    }
    // Return the parsed config data, after stripping the file of comments:
    return JSON.parse(stripComments(contents));
}


// "Class" that abstracts Wiseau config files.
//
// Usage for creating a new config file:
// var config = new BuildConfig(...)
function BuildConfig() {
    this.path = null;
    this.data = {};
    this.targets = [];
}

BuildConfig.prototype._parseTargets = function() {
    // TODO: Parse the target data into a meaningful object:
    this.targets = this.data.targets;
}

// Static factory function that creates a new config file at the specified
// path.
BuildConfig.create = function(path) {
    var bc = new BuildConfig();
    bc.path = path;
    bc.data = createFile(path);
    bc._parseTargets();
    return bc;
}

// Static method that loads an existing config file from the filesystem.
// Returns a new BuildConfig instance if the config file exists.
BuildConfig.load = function(path) {

}

exports.BuildConfig = BuildConfig;

exports.getPath = getConfigPath;
exports.parse = parseConfig;
exports.create = createFile;
