/*global -$ */
'use strict';
var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  args = require('minimist')(process.argv.slice(2)),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,


  config = {
    paths: {
      srcDir: 'app',
      distDir: 'dist',
      tmpDir: '.tmp',
      tmpStyles: '.tmp/styles',
      tmpScripts: '.tmp/scripts',
      fonts: 'assets/fonts',
      srcScripts: 'app/lib/scripts',
      srcStyles: 'app/lib/styles',
      srcScss: 'app/main.scss',
      srcComponents: 'app/components',
      srcImages: 'assets/images',
      vendorSrc: 'vendor',
      vendorDist: 'dist/vendor',
      distScripts: 'dist/scripts',
      distStyles: 'dist/styles',
      distFonts: 'dist/fonts'
    },

    opts: {
      sass: {
        outputStyle: 'nested',
        precision: 10,
        includePaths: ['.'],
        onError: console.error.bind(console, 'Sass error: ')
      },
      images: {

        progressive: true,
        interlaced: true,
        // don't remove IDs from SVGs -- we want them
        // as hooks for embedding and styling
        svgoPlugins: [{cleanupIDs: false}]
      }
    }
  },

  buildingDist = !!(args.dist);


gulp.task('styles', function () {
  return gulp.src([
    config.paths.srcScss
    //config.paths.srcComponents + '/**/*.scss'
  ])
    .pipe($.sourcemaps.init())
    .pipe($.sass(config.opts.sass))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe($.if(buildingDist, gulp.dest(config.paths.distDir)))
    .pipe($.if(!buildingDist, gulp.dest(config.paths.tmpDir)))
    .pipe(reload({stream: true}))

    // move over any remaining CSS files (e.g normailize.css)
    .pipe(gulp.src([
      config.paths.srcDir + '*.css',
      config.paths.srcStyles + '/**/*.css',
      config.paths.srcComponents + '/**/*.css'
    ])
  )
    .pipe($.if(buildingDist, gulp.dest(config.paths.distStyles)))
    .pipe($.if(!buildingDist, gulp.dest(config.paths.tmpStyles)))

    .pipe(reload({stream: true}));
});


gulp.task('styles:dist', function () {
  return gulp.src(config.paths.srcScss)
    .pipe($.sourcemaps.init())
    .pipe($.sass(config.opts.sass))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(config.paths.distDir))
    .pipe(reload({stream: true}))

    // move over any remaining CSS files (e.g normailize.css)
    .pipe(gulp.src([
      config.paths.srcDir + '*.css',
      config.paths.srcStyles + '/**/*.css',
      config.paths.srcComponents + '/**/*.css'
    ]))
    .pipe(gulp.dest(config.paths.distStyles))

    .pipe(reload({stream: true}));
});


gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});


gulp.task('scripts', ['jshint'], function () {
  return gulp.src(
    [
      config.paths.srcScripts + '/**/*.js',
      config.paths.srcComponents + '/**/*.js',
      config.paths.srcDir + '*.js'
    ]
  )
    .pipe($.uglify())
    .pipe($.if(!buildingDist, gulp.dest(config.paths.tmpScripts)))
    .pipe($.if(buildingDist, gulp.dest(config.paths.distScripts)));
});

//
//// TODO: Combine into one task, and act accoriding to a "production?" boolean
//gulp.task('scripts:dist', ['jshint'], function () {
//  return gulp.src(
//    [
//      config.paths.srcScripts + '/**/*.js',
//      config.paths.srcComponents + '/**/*.js',
//      config.paths.srcDir + '*.js'
//    ]
//  )
//    //.pipe($.concat('app.js'))  // TODO: concat into one file for dist
//    .pipe($.uglify())
//    .pipe(gulp.dest(config.paths.distScripts));
//});


gulp.task('html', ['styles', 'scripts'], function () {

  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src(config.paths.srcDir + '/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest(config.paths.distDir));
});


//gulp.task('html:dist', ['styles:dist', 'scripts:dist'], function () {
//
//  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});
//
//  return gulp.src(config.paths.srcDir + '/*.html')
//    .pipe(assets)
//    .pipe($.if('*.js', $.uglify()))
//    .pipe($.if('*.css', $.csso()))
//    .pipe(assets.restore())
//    .pipe($.useref())
//    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
//    .pipe(gulp.dest(config.paths.distDir));
//});


gulp.task('images', function () {
  return gulp.src(config.paths.srcImages + '/**/*.{gif,jpg,png,svg}')
    .pipe($.cache($.imagemin(config.opts.images)))
    .pipe(gulp.dest(config.paths.distDir + '/images'));
});


gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat(config.paths.fonts + '/**/*'))
    .pipe(gulp.dest(config.paths.tmpDir + '/fonts'))
    .pipe(gulp.dest(config.paths.distDir + '/fonts'));
});


/**
 * Move vendor files to the distribution package
 */
gulp.task('vendor', function () {
  return $.if(buildingDist,
    gulp.src(config.paths.vendorSrc + '/**/*', {
    dot: true
  })
    .pipe(gulp.dest(config.paths.vendorDist)));
});


gulp.task('extras', function () {
  return gulp.src([
    config.paths.srcDir + '/*.*',
    '!' + config.paths.srcDir + '/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest(config.paths.distDir));
});

gulp.task('clean', require('del').bind(null, [config.paths.tmpDir, config.paths.distDir]));

gulp.task('serve', ['styles', 'fonts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: [config.paths.tmpDir, config.paths.srcDir],
      routes: {
        '/vendor': 'vendor'
      }
    }
  });

  // watch for changes
  gulp.watch([
    config.paths.srcDir + '/*.html',
    config.paths.srcScripts + '/**/*.js',
    config.paths.images + '/**/*',
    config.paths.tmpDir + '/fonts/**/*'
  ]).on('change', reload);

  gulp.watch(
    [
      config.paths.srcStyles + '/**/*.scss',
      config.paths.srcDir + '/**/*.scss'
    ],
    ['styles']
  );

  gulp.watch(config.paths.fonts + '/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src(config.paths.srcStyles + '/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest(config.paths.srcStyles));

  gulp.src(config.paths.srcDir + '/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest(config.paths.srcDir));
});


gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'vendor', 'extras'], function () {
  return gulp.src(config.paths.distDir + '/**/*').pipe($.size({title: 'build', gzip: true}));
});


//gulp.task('build:dist',
//  [
//    'jshint',
//    'html:dist',
//    'images',
//    'fonts',
//    'vendor',
//    'extras'
//  ],
//  function () {
//    return gulp.src(config.paths.distDir + '/**/*').pipe($.size({title: 'build-dist', gzip: true}))
//  }
//);


//gulp.task('dist', ['clean'], function () {
//  gulp.start('build');
//});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
