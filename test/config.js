var fs = require('fs');
var path = require('path');
var assert = require('chai').assert;
var BuildConfig = require('../lib/config').BuildConfig;

var fixturesDir = path.resolve(__dirname, 'fixtures');

describe('BuildConfig', function() {
    var test_path = path.resolve(fixturesDir, 'testconfig.json');

    it('creates a new config file with create()', function() {
        var bc = BuildConfig.create(test_path);
        assert.ok(bc);

        // Make sure the created config file contains basic attributes:
        assert.ok(bc.data.sourceDir);
        assert.ok(bc.data.outputDir);
        assert.ok(bc.data.targets);

        // There should be one target in the initial config:
        assert.length(Object.keys(bc.targets), 1);
    });

    afterEach(function() {
        // Remove our test config file, if it was created:
        try {
            fs.unlinkSync(test_path);
        }
        catch (error) {}
    });
});
