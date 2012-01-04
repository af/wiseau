var fs = require('fs'),
    path = require('path'),
    config = require('./config');


// Initialize a new project by creating a new project.json file
exports.create_project = function(options) {
    var configPath = config.getPath(options);
    config.create(configPath);
};


// Placeholder for the function that will actually build the project
exports.build = function(options) {
    config.parse(options, function(configData) {
        console.log('BUILD IT, using', configData);
    });
};
