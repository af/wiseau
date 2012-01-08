var fs = require('fs'),
    path = require('path'),
    config = require('./config');
var BuildConfig = config.BuildConfig;



// Initialize a new project by creating a new clientbuild.json file
exports.create_project = function(options) {
    var configPath = config.get_path(options);
    var configObj = BuildConfig.create(configPath);
};

// Placeholder for the function that will actually build the project
exports.build = function(options) {
    var configPath = config.get_path(options);
    var configObj = BuildConfig.load(configPath);
    var loaders = require('./loaders').init();

    if (configObj) {
        var targets = configObj.targets;
        for (var name in targets) {
            targets[name].build(loaders);
        }
    }
};
