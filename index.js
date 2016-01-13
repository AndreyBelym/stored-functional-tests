var Site                   = require('./site/index');
var createTestCafe         = require('../testcafe');
var testCafeBrowserNatives = require('../testcafe-browser-natives');
var glob                   = require('glob');
var Promise                = require('Promise');

var site = new Site(3002, 3003, './views');

site.create();

var testCafe     = null;
var brConnection = null;

glob('./tests/**/*.js', function (err, files) {
    createTestCafe('localhost', 1339, 1340)
        .then(function (tc) {
            testCafe     = tc;
            brConnection = tc.createBrowserConnection();

            return testCafeBrowserNatives.getBrowserInfo('chrome');
        })
        .then(function (chromeInfo) {
            return testCafeBrowserNatives.open(chromeInfo, brConnection.url);
        })
        .then(function () {
            return testCafeBrowserNatives.resize(brConnection.idleUrl, 1000, 600);
        })
        .then(function () {
            var runner = testCafe.createRunner();

            return runner
                .reporter('json')
                .src(files)
                .browsers(brConnection)
                .filter(function (name, fixture) {
                    //return name === 'Move to the element in the scrolled container';
                    //return name === 'Move after an active iframe is removed';
                    return fixture === 'move';
                })
                .run();
        })
        .then(function () {
            site.destroy();
        })
        .catch(function (err) {
            console.log('Error', err);
        })
        .then(function () {
            return testCafeBrowserNatives.close(brConnection.idleUrl);
        })
        .then(function () {
            process.exit(0);
        });
});

