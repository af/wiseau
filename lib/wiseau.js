var fs = require('fs'),
    path = require('path'),
    config = require('./config');
var BuildConfig = config.BuildConfig;


// Given a dependency string, resolve it into a chunk of javascript that should
// end up in a build target.
function process_dependency(dep_string) {
    return 'dependency: ' + dep_string;
}

// Build a single target, based on its name and the BuildConfig.
function build_target(name, configObj, loaders) {
    var mkdir_recursive = require('./utils').mkdir_recursive;
    var sourceDir = configObj.getSourceDirForTarget(name);
    var outputDir = configObj.getOutputDirForTarget(name);
    var fullOutputPath = path.resolve(outputDir, name);

    var doBuild = function() {
        var dependencies = configObj.targets[name].dependencies || [];
        var outputChunks = dependencies.map(function(dep) {
            return loaders.get(dep);
        });
        fs.writeFileSync(fullOutputPath, outputChunks.join(';\n'));
        console.log('* built', name, 'at', fullOutputPath);
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
    var configPath = config.get_path(options);
    var configObj = BuildConfig.create(configPath);
};

// Placeholder for the function that will actually build the project
exports.build = function(options) {
    var configPath = config.get_path(options);
    var configObj = BuildConfig.load(configPath);
    var loaders = require('./loaders').init(configObj);

    if (configObj) {
        var targets = configObj.targets;
        for (var name in targets) {
            build_target(name, configObj, loaders);
        }
    }
};
