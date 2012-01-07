var fs = require('fs');
var path = require('path');
var assert = require('chai').assert;
var BuildConfig = require('../lib/config').BuildConfig;

var test_paths = {
    fixtureDir: path.resolve(__dirname, 'fixtures'),
    loadTest:   path.resolve(__dirname, 'fixtures', 'load_test.json'),
    createTest: path.resolve(__dirname, 'fixtures', 'create_test.json')
}

describe('BuildConfig', function() {
    it('creates a new config file', function() {
        var bc = BuildConfig.create(test_paths.createTest);
        assert.ok(bc);

        // Make sure the created config file contains basic attributes:
        assert.ok(bc.data.sourceDir);
        assert.ok(bc.data.outputDir);
        assert.ok(bc.data.targets);

        // There should be one target in the initial config:
        assert.length(Object.keys(bc.targets), 1);
    });

    it('loads existing config files', function() {
        var bc = BuildConfig.load(test_paths.loadTest);
        assert.ok(bc);
        assert.ok(bc.data);
        assert.equal(bc.data.sourceDir, 'js/src');
        assert.length(Object.keys(bc.targets), 1);
    });

    it('fails correctly when a specified config file does not exist', function() {
        var fn = function() {
            var bc = BuildConfig.load('invalid_name');
        };
        assert.throws(fn, Error);
    });

    afterEach(function() {
        // Remove our test config file, if it was created:
        try {
            fs.unlinkSync(test_paths.createTest);
        }
        catch (error) {}
    });
});
