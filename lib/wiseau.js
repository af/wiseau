var fs = require('fs'),
    path = require('path'),
    config = require('./config');


// Given a dependency string, resolve it into a chunk of javascript that should
// end up in a build target.
function process_dependency(dep_string) {
    //TODO: implement me.
    return 'dependency: ' + dep_string;
}

// Build a single target, based on its name, the options specified for this
// target, and the global build options.
function build_target(name, options, globalOptions) {
    var mkdir_recursive = require('./utils').mkdir_recursive;
    var sourceDir = options.sourceDir || globalOptions.sourceDir;
    var outputDir = options.outputDir || globalOptions.outputDir;
    var fullOutputPath = path.resolve(outputDir, name);

    var doBuild = function() {
        var dependencies = options.dependencies || [];
        var outputChunks = [];
        console.log('* building', name, 'at', fullOutputPath);
        dependencies.forEach(function(dep) {
            var dependencyOutput = process_dependency(dep);
            outputChunks.push(dependencyOutput);
        });
        fs.writeFileSync(fullOutputPath, outputChunks.join(';\n'));
    }

    // Create the output directory if if doesn't already exist:
    if (path.existsSync(outputDir)) {
        doBuild();
    }
    else {
        console.log('Creating new output directory:', outputDir);
        mkdir_recursive(path.resolve(outputDir), null, function(err) {
            if (err) { throw err; }
            doBuild();
        });
    }
}

// Initialize a new project by creating a new clientbuild.json file
exports.create_project = function(options) {
    var configPath = config.getPath(options);
    config.create(configPath);
};

// Placeholder for the function that will actually build the project
exports.build = function(options) {
    var configPath = config.getPath(options);
    var configObj = config.parse(configPath);
    if (configObj) {
        var targets = configObj.targets;
        for (var name in targets) {
            build_target(name, targets[name], configObj);
        }
    }
};
