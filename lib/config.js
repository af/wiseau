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


// Given an options hash from the CLI parser, return the path to use for the
// config file.
function getConfigPath(cli_options) {
    var defaultName = 'clientbuild.json',
        configPath = cli_options.configFile || defaultName,
        fullPath = path.resolve(path.join(process.env.PWD, configPath));
    return fullPath;
}


// Given an options object from the CLI parser, return the parsed configuration
// object for the project.
function parseConfig(configPath) {
    var data, configObj;
    try {
        data = fs.readFileSync(configPath, 'utf8');
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


// Object type that represents a build target.
function Target(name, targetConfig) {
    this.name = name;
    this.config = targetConfig;
    this.dependencies = targetConfig.dependencies || [];
}

// Minify a javascript string with uglify-js:
Target.prototype.minify = function(input) {
    var parser = require("uglify-js").parser;
    var uglify = require("uglify-js").uglify;
    var ast = parser.parse(input);
    ast = uglify.ast_mangle(ast);
    ast = uglify.ast_squeeze(ast);
    return uglify.gen_code(ast);
}

// Build the target, based on its name and the BuildConfig.
// Returns the processed output string.
Target.prototype.build = function(loaders) {
    var outputDir = this.config.outputDir;
    var fullOutputPath = path.resolve(outputDir, this.name);
    var self = this;

    var doBuild = function() {
        console.log('* building', self.name, 'at', fullOutputPath);
        var outputChunks = self.dependencies.map(function(dep) {
            return loaders.fetch(dep, self.config);
        });
        var output = outputChunks.join(';\n');
        output = self.config.minify ? self.minify(output) : output;
        fs.writeFileSync(fullOutputPath, output);
    }

    // Create the output directory if if doesn't already exist:
    if (path.existsSync(outputDir)) { doBuild(); }
    else {
        var mkdir_recursive = require('./utils').mkdir_recursive;
        console.log('Creating new output directory:', outputDir);
        mkdir_recursive(path.resolve(outputDir), null, function(err) {
            if (err) { throw err; }
            doBuild();
        });
    }
}


// "Class" that abstracts Wiseau config files.
//
// Usage for creating a new config file:
// var config = BuildConfig.create(path)
//
// Loading an existing config file:
// var config = BuildConfig.load(path)
function BuildConfig() {
    this.path = null;
    this.data = {};
    this.targets = {};
}

// Parse the target config data into a hash of Target instances
BuildConfig.prototype._parseTargets = function() {
    var target_names = Object.keys(this.data.targets);
    var self = this;
    target_names.forEach(function(name) {
        var targetConfig = self.data.targets[name];

        // Fill in default values if they weren't specified for this target.
        // Every property from the global config (except "targets") should be
        // used as a default value.
        var props = Object.keys(self.data);
        props.forEach(function(p) {
            if (p !== 'targets') {
                // Only use a default global value if the target's config value is undefined:
                if (targetConfig[p] === undefined) { targetConfig[p] = self.data[p]; }
            }
        });

        var t = new Target(name, targetConfig);
        self.targets[name] = t;
    });
}

// Return the absolute path where source files are located.
BuildConfig.prototype.getSourceDir = function() {
    return path.resolve(path.join(process.env.PWD, this.data.sourceDir));
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
    var bc = new BuildConfig();
    var configObj = parseConfig(path);
    if (!configObj) {
        throw new Error('Could not load the specified config file');
    }
    bc.data = configObj;
    bc.path = path;
    bc._parseTargets();
    return bc;
}

exports.BuildConfig = BuildConfig;
exports.get_path = getConfigPath;
