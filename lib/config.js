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

// Initial json config, used for new projects:
var initial = {
    "sourceDir": "js/src",
    "outputDir": "js/build",

    "targets": {
        "libs.min.js": {
            "dependencies": [
                "http://code.jquery.com/jquery-1.7.1.js",
                "http://documentcloud.github.com/underscore/underscore.js",
            ]
        },
        "app.min.js": {
            "sourceDir": "js/src/myApp",    // Can override this per target.
            "dependencies": [
                "models.js",
                "app.js",
            ]
        }
    }
};


// Helper function to strip single-line comments ("//") from a multi-line string.
function stripComments(data) {
    var lines = data.split('\n'),
        output = [];
    lines.forEach(function(line) {
        output.push(line.replace(/(^:)\/\/.*/, ''));
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
            for (var k in defaults) {
                if (config[k] === undefined) {
                    config[k] = defaults[k];
                }
            }
            callback(config);
        }
    });
}

// Create a new config file at the given path
function createFile(configPath) {
    var data = JSON.stringify(initial, null, 4);

    // Ensure that we don't overwrite an existing file:
    if (path.existsSync(configPath)) {
        console.error('Config file already exists at', configPath);
    }
    else {
        fs.writeFile(configPath, data, function(err) {
            if (err) { throw err; }
            else {
                console.log('Created a new Wiseau project file at', configPath);
            }
        });
    }
}

exports.getPath = getConfigPath;
exports.parse = parseConfig;
exports.create = createFile;
