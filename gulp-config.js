module.exports = function () {
    'use strict';

    var path = require('path'),

        clientDirName = 'src/client',
        serverDirName = 'src/server',
        clientAppDirName = 'src/client/app',
        srcDirName = 'src',
        distDirName = 'dist',
        tmpDirName = '.tmp',
        reportDirName = 'report',
        specRunnerFileName = 'specs.html',

        rootDirPath = path.resolve(__dirname),
        srcClientDirPath = path.join(__dirname, clientDirName),
        srcServerDirPath = path.join(__dirname, serverDirName),
        wiredep = require('wiredep'),
        bowerFiles = wiredep(
            {
                devDependencies: true,
                //directory: path.join(__dirname, 'vendor/')
            }
        ).js,

        defaultPort = 9988,

        /**
         * helper method to generate resolveTo`X` paths, rooted at the app root
         */
        resolveToSrcClient = function resolveToSrcClient(resolvePath) {
            return function (glob) {
                glob = glob || '';
                return path.join(clientDirName, resolvePath, glob);
            };
        },

        resolveToSrcServer = function resolveToSrcServer(resolvePath) {
            return function (glob) {
                glob = glob || '';
                return path.join(serverDirName, resolvePath, glob);
            };

        },

        resolveToSrcApp = resolveToSrcClient('app'),  // app/{glob}
        resolveToSrcComponents = resolveToSrcClient('app/components'),
        resolveToSrcAssets = resolveToSrcClient('assets'),


        resolveToTmp = function resolveToTmp (resolvePath) {
            return function (glob) {
                glob = glob || '';
                return path.join(tmpDirName, resolvePath, glob);
            };
        },

        resolveToTmpApp = resolveToTmp('app'),
        resolveToTmpAssets = resolveToTmp('assets'),



        srcIndexHTML = path.join(__dirname, clientDirName, 'index.html'),

        config = {
            distDirName: distDirName,
            tmpDirName: tmpDirName,
            srcDirName: srcDirName,
        };

    config.paths = {
        srcIndexHTML: srcIndexHTML,
        srcImages: resolveToSrcAssets('images/**/*.{gif,jpg,png,svg}'),

        ////// Path names //////
        distDirPath: path.join(__dirname, distDirName),
        srcDirPath: path.join(__dirname, srcDirName),
        tmpDirPath: path.join(__dirname, tmpDirName),
        srcClientDirPath: srcClientDirPath,

        vendorSrc: path.join(__dirname, 'vendor'),

        tmpApp: path.join(__dirname, tmpDirName, 'app'),
        tmpAssets: path.join(__dirname, tmpDirName, 'assets'),

        vendorDist: path.join(__dirname, distDirName, 'vendor'),
        distApp: path.join(__dirname, distDirName, 'app'),
        distAssets: path.join(__dirname, distDirName, 'assets'),
        distImages: path.join(__dirname, distDirName, 'assets/images'),
        distFonts: path.join(__dirname, distDirName, 'assets/fonts'),

        rootPath: rootDirPath,

        srcServerDirPath: srcServerDirPath,
        nodeServerFilePath: resolveToSrcServer('server.js'),


        bower: {
            json: path.join(__dirname, './bower.json'),
            directory: path.join(__dirname, './vendor/')
        },


        // Packages to source when bumping package versions
        packages: [
            path.join(rootDirPath, 'package.json'),
            path.join(rootDirPath, 'bower.json')
        ],

        // all of the JS that we want to vet
        vettedJS: [
            resolveToSrcApp('**/*.js'),
            '!./jspm.config.js',
            '!./karma.conf.js',
            '!./gulp-config.js',
            './*.js'  // vet our own top-level JS files such as gulpfile.js
        ],

        srcJS: [
            resolveToSrcAssets('/scripts/**/*.js'),
            resolveToSrcComponents('**/*.js'),
            resolveToSrcApp('**/*.js'),
            '!' + resolveToSrcApp('/**/*.spec.js')
        ],

        srcSCSS: [
            resolveToSrcApp('main.scss'),
            resolveToSrcAssets('styles/**/*.scss')
        ],

        srcHTML: [
            resolveToSrcApp('**/*.html'),
            srcIndexHTML
        ],

        srcFonts: [
            path.join(resolveToSrcAssets('fonts'), '**/*.{eot,svg,ttf,woff,woff2}')
        ],

        // Any CSS files that we might just want to move
        //around without processing (e.g. normalize.css)
        extraCSS: [
            path.join(__dirname, 'vendor/savvy/dist/savvy.min.css')
        ],

        // Extra config and dotfiles in the root (e.g, robots.txt)
        // that we just want to move around
        rootExtras: [
            resolveToSrcApp('*.*'),
            '!' + resolveToSrcApp('*.html')
        ],


        ///// Custom HTML Injects (CAREFUL: Order MIGHT matter here) //////

        /* Inject CSS after it has been compiled to .tmp */
        injectedCustomCSS: [
            //resolveToTmpAssets('styles/normalize.css'),
            resolveToTmpApp('main.css'),
            resolveToTmpApp('savvy.min.css')
        ],

        injectedCustomJS: [
            path.join(__dirname, 'vendor', 'modernizr/modernizr.js'),
            resolveToSrcAssets('scripts/base-plugins.js'),
            path.join(__dirname, 'vendor', 'gsap/src/minified/plugins/BezierPlugin.min.js'),
            path.join(__dirname, 'vendor', 'gsap/src/minified/TweenMax.min.js'),
            resolveToSrcComponents('**/*.js'),
            resolveToSrcApp('*.js'),
            '!' + resolveToSrcApp('/**/*.spec.js')
        ],

        specFiles: path.join(srcClientDirPath, '**/*.spec.js'),

        specRunnerFilePath: path.join(
            srcClientDirPath,
            specRunnerFileName
        ),

        specHelpers: path.join(
            srcClientDirPath,
            'test-helpers/*.js'
        ),

        /**
         * Paths to libraries needed for running tests
         * (Injected into mocha spec runner template)
         */
        testLibraries: [
            'node_modules/mocha/mocha.js',
            'node_modules/chai/chai.js',
            'node_modules/sinon-chai/lib/sinon-chai.js'
        ]


    };

    config.defaultPort = defaultPort;
    config.sassOpts = {
        outputStyle: 'expanded',
        precision: 10,
        includePaths: ['.'],
        onError: console.error.bind(console, 'Sass error: ')
    };

    config.imageMinOpts = {
        progressive: true,
        interlaced: true,
        // don't remove IDs from SVGs -- we want them
        // as hooks for embedding and styling
        svgoPlugins: [{cleanupIDs: false}],
        optimizationLevel: 4
    };


    config.injectCSSSourceOpts = {
        read: false,
        cwd: path.join(__dirname, srcClientDirPath)
    };


    config.browserReloadDelay = 1000; // ms

    /**
     * Karma config settings
     */
    config.karma = getKarmaFiles();


    /**
     * Karama AND general testing settings
     */
    config.serverIntegrationSpecs = [
        path.join(
            config.paths.srcClientDirPath,
            'tests/server-integration/**/*.spec.js'
        )
    ];

    /**
     * Use a different port for the forked process that any
     * integration tests will run on
     */
    config.integrationTestServerPort = defaultPort + 1;

    config.getWireDepOpts = function getWiredepOpts() {
        var options = {
            bowerJson: require(config.paths.bower.json),
            directory: config.paths.bower.directory,
            ignorePath: '../..'
        };
        return options;
    };

    config.getBrowserSyncOpts = function getBrowserSyncOpts (isDev, isSpecRunner, isUsingNodeMon) {

        // Default options across all varities of browserSyncing
        var options = {
            notify: isUsingNodeMon ? true : false,
            port: isUsingNodeMon ? 3000 : 3001,
            ghostMode: {
                clicks: true,
                location: false,
                forms: true,
                scroll: true
            },
            injectChanges: true,   // inject just the file that changed
            logFileChanges: true,
            logLevel: 'debug',
            logPrefix: 'portfolio-source-files',
            reloadDelay: config.browserReloadDelay
        };


        // Depending on whether or not we're using nodemon, our browsersync
        // task will either run with a proxy or set up its own server
        if (isUsingNodeMon) {

            // proxy the default port on the port browsersync is using
            options.proxy = 'localhost:' + defaultPort;

            options.files = isDev ?
                [
                    srcClientDirPath + '/**/*.*',
                    '!' + config.paths.srcSCSS,
                    // catch changes to css as its built to .tmp
                    config.paths.tmpDirPath + '/**/*.css'
                ] :
                // in build mode, we'll have watched first,
                // and we don't want to watch here
                [];
        } else {
            options.server = {
                baseDir: [config.paths.tmpDirPath, config.paths.srcClientDirPath],
                routes: {
                    '/vendor': 'vendor',
                    '/src': 'src',
                    '/.tmp': '.tmp'
                }
            };
        }

        if (isSpecRunner) {
            options.startPath = specRunnerFileName;
        }

        return options;
    };

    return config;

    function getKarmaFiles () {

        var options = {

            // TODO: config is still undefined when this function runs, so I think trying to use it in the "files" array needs to be fixed
            files: [].concat(
                bowerFiles,
                //config.specHelpers,
                //path.join(__dirname, clientDirName, '/**/*.module.js'),
                resolveToSrcApp('**/*.js'),
                resolveToSrcAssets('scripts/**/*.js'),
                //path.join(__dirname, tmpDirName, config.templateCache.file),
                config.serverIntegrationSpecs
            ),
            exclude: [].concat(
                config.serverIntegrationSpecs
            ),
            coverage: {
                dir: path.join(__dirname, reportDirName, 'coverage'),
                reporters: [
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    {type: 'text-summary'}
                ]
            },
            preprocessors: {},
            configFile: __dirname + '/karma.conf.js'
        };

        // anywhere in the clientAppDir, ignore the spec files, but get all other JS
        options.preprocessors[path.join(__dirname, clientAppDirName, '/**/!(*.spec)+(.js)')] = ['coverage'];

        return options;
    }

};
