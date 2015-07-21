module.exports = function () {
    'use strict';

    var path = require('path'),

        root = 'src/client',
        distDir = 'dist/',
        tmpDir = '.tmp/',

        defaultPort = 9988,

        /**
         * helper method to generate resolveTo`X` paths, rooted at the app root
         */
        resolveTo = function resolveTo(resolvePath) {
            return function (glob) {
                glob = glob || '';
                return path.join(root, resolvePath, glob);
            };
        },

        resolveToApp = resolveTo('app'),  // app/{glob}
        resolveToComponents = resolveTo('app/components'),
        resolveToAssets = resolveTo('assets'),
        resolveToVendor = resolveTo('vendor'),

        srcIndexHTML = path.join(__dirname, root, 'index.html'),

        config = {};

    config.paths = {
        srcIndexHTML: srcIndexHTML,
        srcAssets: resolveToAssets(),
        srcImages: resolveToAssets('images/**/*.{gif,jpg,png,svg}'),
        srcFonts: resolveToAssets('fonts/**/*'),

        ////// Location names //////
        dist: path.join(__dirname, distDir),
        tmp: path.join(__dirname, tmpDir),
        srcRoot: path.join(__dirname, root),

        vendorSrc: path.join(__dirname, root + '/vendor/**/*'),

        tmpApp: path.join(__dirname, tmpDir + 'app/'),
        tmpAssets: path.join(__dirname, tmpDir + 'assets/'),

        vendorDist: path.join(__dirname, distDir + 'vendor/'),
        distApp: path.join(__dirname, distDir + 'app/'),
        distAssets: path.join(__dirname, distDir + 'assets/'),


        bower: {
            json: './bower.json',
            directory: path.join(__dirname, root, 'vendor'),
            ignorePath: ''
        },

        // all of the JS that we want to vet
        vettedJS: [
            resolveToApp('**/*.js'),
            '!./jspm.config.js',
            './*.js'  // vet our own top-level JS files such as gulpfile.js
        ],

        srcJS: [
            resolveToAssets('/scripts/**/*.js'),
            resolveToComponents('**/*.js'),
            resolveToApp('**/*.js'),
            '!' + resolveToApp('/**/*.spec.js')
        ],

        srcSCSS: [
            resolveToApp('main.scss'),
            resolveToAssets('styles/**/*.scss')
        ],

        srcHTML: [
            resolveToApp('**/*.html'),
            srcIndexHTML
        ],

        // Any CSS files that we might just want to move
        //around without processing (e.g. normalize.css)
        extraCSS: [
            resolveToApp('*.css'),
            resolveToAssets('styles/**/*.css'),
            resolveToComponents('/**/*.css')
        ],

        // Extra config and dotfiles in the root (e.g, robots.txt)
        // that we just want to move around
        rootExtras: [
            resolveToApp('*.*'),
            '!' + resolveToApp('*.html')
        ],


        ///// Custom HTML Injects (CAREFUL: Order MIGHT matter here) //////

        injectedCustomCSS: [
            resolveToAssets('styles/normalize.css'),
            path.join(__dirname, tmpDir, '/app/main.css')
        ],

        injectedCustomJS: [
            resolveToVendor('modernizr/modernizr.js'),
            resolveToAssets('scripts/base-plugins.js'),
            resolveToVendor('gsap/BezierPlugin.min.js'),
            resolveToVendor('gsap/TweenMax.min.js'),
            resolveToComponents('**/*.js'),
            resolveToApp('*.js'),
            '!' + resolveToApp('/**/*.spec.js')
        ]
    };

    config.defaultPort = defaultPort;
    config.sassOpts = {
        outputStyle: 'nested',
        precision: 10,
        includePaths: ['.'],
        onError: console.error.bind(console, 'Sass error: ')
    };

    config.imageMinOpts = {
        progressive: true,
        interlaced: true,
        // don't remove IDs from SVGs -- we want them
        // as hooks for embedding and styling
        svgoPlugins: [{cleanupIDs: false}]
    };

    config.browserSyncOpts = {
        proxy: 'localhost:' + defaultPort,  // proxy the default port....
        port: 3000,                         // ... on this port

        files: []
        // Track different parts and events of the browser
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,   // inject just the file that changed
        logFileChanges: true,
        logPrefix: 'portfolio-source-files',
        notify: true,
        reloadDelay: 1000  // ms
    };

    config.getWireDepOpts = function getWiredepOpts() {
        var options = {
            bowerJson: config.paths.bower.json,
            directory: config.paths.bower.directory
            // ignorePath: config.paths.bower.ignorePath
        };
        return options;
    };

    return config;
};
