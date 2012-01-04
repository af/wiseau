var fs = require('fs'),
    path = require('path');

// Default config values:
var defaults = {
    sourceDir: 'js/src',
    outputDir: 'js/build',
    targets: {}
};


// Helper function to strip single-line comments ("//") from a multi-line string.
function stripComments(data) {
    var lines = data.split('\n'),
        output = [];
    lines.forEach(function(line) {
        output.push(line.replace(/\/\/.*/, ''));
    });
    return output.join('\n');
}


function getConfigPath(options) {
    var defaultName = 'project.json',
        configPath = options.configFile || defaultName,
        fullPath = path.normalize(path.join(process.env.PWD, configPath));
    return fullPath;
}


// Given an options object from the CLI parser, return the parsed configuration
// object for the project.
function parseConfig(options, callback) {
    var configPath = getConfigPath(options);

    fs.readFile(configPath, 'utf8', function(err, data) {
        var config;
        if (err) { console.error('Could not load config!'); }
        else {
            // Strip single-line comments out from the json file:
            data = stripComments(data);
            config = JSON.parse(data);

            // Fill in default values for any keys not in the parsed config:
            for (k in defaults) {
                if (config[k] === undefined) {
                    config[k] = defaults[k];
                }
            }
            callback(config);
        }
    });
}

// Create a new project.json file
exports.create_project = function(options) {
    var configPath = getConfigPath(options),
        data = JSON.stringify(defaults, null, 4);

    if (path.existsSync(configPath)) {
        // Ensure that we don't overwrite an existing file:
        console.error('Config file already exists at', configPath);
        return;
    }
    fs.writeFile(configPath, data, function(err) {
        if (err) { throw err; }
        else {
            console.log('Created a new Wiseau project file at', configPath);
        }
    });
};


// Placeholder for the function that will actually build the project
exports.build = function(options) {
    parseConfig(options, function(config) {
        console.log('BUILD IT, using', config);
    });
};