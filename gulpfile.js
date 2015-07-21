/*global -$ */
'use strict';
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({lazy: true}),
//args = require('minimist')(process.argv.slice(2)),
    browserSync = require('browser-sync'),
    del = require('del'),
    reload = browserSync.reload,
    yargs = require('yargs').argv,


    config = require('./gulp-config')(),
    port = process.env.PORT || config.defaultPort,
    paths = config.paths,


    log = function log(msg) {

        if (typeof msg === 'object') {
            for (var item in msg) {
                if (msg.hasOwnProperty(item)) {
                    $.util.log($.util.colors.blue(msg[item]));
                }
            }
        } else {
            $.util.log($.util.colors.blue(msg));
        }
    },

    clean = function clean(path, done) {
        log('Cleaning: ' + $.util.colors.blue(path));
        del(path, done);
    },

    startBrowserSync = function startBrowserSync () {

        if (browserSync.active) {
            return;
        }

        log('Starting browser-sync on port ' + port);


    },


    buildingProd = !!(yargs.production);  // default to building dist unless run with ``` gulp --dev


gulp.task('styles', ['clean-styles'], function () {

    log('Compiliing SCSS to CSS');

    return gulp.src(paths.srcSCSS, {base: paths.srcRoot})
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass(config.sassOpts))
        .pipe($.postcss([
            require('autoprefixer-core')({browsers: ['last 2 version', '> 5%']})
        ]))
        .pipe($.sourcemaps.write())
        .pipe($.if(buildingProd, gulp.dest(paths.dist)))
        .pipe($.if(!buildingProd, gulp.dest(paths.tmp)))
        .pipe(reload({stream: true}))

        // move over any remaining CSS files (e.g normailize.css)
        .pipe(gulp.src(paths.extraCSS, {base: paths.srcRoot}))
        .pipe($.if(buildingProd, gulp.dest(paths.dist)))
        .pipe($.if(!buildingProd, gulp.dest(paths.tmp)))

        .pipe(reload({stream: true}));
});


gulp.task('clean-styles', function (done) {
    var files = paths.tmp + '/**/*.css';
    clean(files, done);
});


gulp.task('vet', function () {

    log('Analyzing JavaScript files');

    return gulp.src(paths.vettedJS)
        .pipe($.if(yargs.verbose, $.print()))
        .pipe($.if(yargs.jscs, $.jscs()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'), {verbose: true})
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});


gulp.task('scripts', ['vet'], function () {
    return gulp.src(paths.srcJS, {base: paths.srcRoot})
        .pipe($.print())
        .pipe($.uglify())
        .pipe($.if(!buildingProd, gulp.dest(paths.tmp)))
        .pipe($.if(buildingProd, gulp.dest(paths.dist)));
});


gulp.task('html', ['styles', 'scripts'], function () {

    var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

    return gulp.src(paths.srcHTML, {base: paths.srcRoot})
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
        .pipe(gulp.dest(paths.dist));
});


gulp.task('images', function () {
    return gulp.src(paths.srcImages)
        .pipe($.cache($.imagemin(config.imageMinOpts)))
        .pipe(gulp.dest(paths.dist));
});


gulp.task('fonts', function () {
    return gulp.src(require('main-bower-files')({
        filter: '**/*.{eot,svg,ttf,woff,woff2}'
    }).concat(paths.srcFonts), {base: paths.srcRoot})
        .pipe(gulp.dest(paths.tmp))
        .pipe(gulp.dest(paths.dist));
});


/**
 * Move vendor files to the distribution package
 */
gulp.task('vendor', function () {
    return $.if(buildingProd,
        gulp.src(paths.vendorSrc, {
            dot: true
        })
            .pipe(gulp.dest(paths.vendorDist)));
});


gulp.task('extras', function () {
    return gulp.src(
        paths.rootExtras,
        {dot: true}
    )
        .pipe(gulp.dest(paths.dist));
});

gulp.task('clean', del.bind(null, [paths.dist, paths.tmp]));

gulp.task('serve', ['styles', 'fonts'], function () {

    startBrowserSync();

    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: [paths.tmp, paths.srcRoot],
            routes: {
                '/vendor': 'vendor'
            }
        }
    });

    //gulp.watch('bower.json', ['wiredep', 'fonts']);
});


gulp.task('styles-watch', function () {
    gulp.watch([paths.srcSCSS], ['styles']);
});


gulp.task('watch', ['serve'], function () {
    // watch for changes
    gulp.watch([
        paths.srcHTML,
        paths.srcJS,
        paths.srcImages,
        paths.srcFonts
    ]).on('change', reload);

    gulp.watch(paths.srcSCSS, ['styles']);
    gulp.watch(paths.srcFonts, ['fonts']);
});


gulp.task('wiredep', function () {
    log('Wiring up bower css, and bower js into HTML');
    var
        wiredep = require('wiredep').stream,
        wireDepOpts = config.getWireDepOpts();


    return gulp
        .src(paths.srcIndexHTML, {base: paths.srcRoot})
        .pipe(wiredep(wireDepOpts))
        .pipe($.inject(gulp.src(paths.injectedCustomJS)))
        .pipe(gulp.dest(paths.srcRoot));  // return html back to srcRoot

});

// inject bower components
gulp.task('inject', ['wiredep', 'styles'], function () {
    log('Injecting custom css and js into HTML... after calling wiredep');

    return gulp
        .src(paths.srcIndexHTML, {base: paths.srcRoot})
        .pipe($.inject(gulp.src(paths.injectedCustomCSS)))
        .pipe(gulp.dest(paths.srcRoot));  // return html back to srcRoot
});


gulp.task('build', ['vet', 'html', 'images', 'fonts', 'vendor', 'extras'], function () {
    return gulp.src(paths.dist + '/**/*').pipe($.size({title: 'build', gzip: true}));
});


gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
