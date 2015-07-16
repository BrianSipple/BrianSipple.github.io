module.exports = function () {
    'use strict';

    var path = require('path'),

        root = 'src/client',

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

        distDir = 'dist/',
        tmpDir = '.tmp/',

        config = {

            paths: {

                // all of the JS that we want to vet
                vettedJS: [
                    resolveToApp('**/*.js'),
                    '!./jspm.config.js',
                    './*.js'  // vet our own top-level JS files such as gulpfile.js
                ],

                allSrcJS: [
                    resolveToApp('**/*.js'),
                    resolveToAssets('/scripts/**/*.js')
                ],

                srcSCSS: [
                    resolveToApp('main.scss'),
                    resolveToAssets('styles/**/*.scss')
                ],

                srcHTML: [
                    resolveToApp('**/*.html'),
                    path.join(root, 'index.html')
                ],
                srcAssets: resolveToAssets(),
                srcImages: resolveToAssets('images/**/*.{gif,jpg,png,svg}'),
                srcFonts: resolveToAssets('fonts/**/*'),
                vendorSrc: path.join(__dirname, root + '/vendor/**/*'),


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


                ////// Destination names //////
                dist: path.join(__dirname, distDir),
                tmp: path.join(__dirname, tmpDir),
                srcRoot: path.join(__dirname, root),

                tmpApp: path.join(__dirname, tmpDir + 'app/'),
                tmpAssets: path.join(__dirname, tmpDir + 'assets/'),

                vendorDist: path.join(__dirname, distDir + 'vendor/'),
                distApp: path.join(__dirname, distDir + 'app/'),
                distAssets: path.join(__dirname, distDir + 'assets/')
            },

            sassOpts: {
                outputStyle: 'nested',
                precision: 10,
                includePaths: ['.'],
                onError: console.error.bind(console, 'Sass error: ')
            },

            imageMinOpts: {
                progressive: true,
                interlaced: true,
                // don't remove IDs from SVGs -- we want them
                // as hooks for embedding and styling
                svgoPlugins: [{cleanupIDs: false}]
            }
        };

    return config;

};
