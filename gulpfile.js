// 获取 gulp
var gulp = require('gulp');
var gutil = require('gulp-util');
var watchPath = require('gulp-watch-path');
var combiner = require('stream-combiner2');

// var sourcemaps = require('gulp-sourcemaps');
// var uglify = require('gulp-uglify');

// var minifycss = require('gulp-minify-css');

var autoprefixer = require('gulp-autoprefixer');

var less = require('gulp-less');
var imagemin = require('gulp-imagemin');

var fileinclude = require('gulp-file-include');

// 打印错误信息
var handleError = function (err) {
    var colors = gutil.colors;
    gutil.log(colors.red(err));
    // gutil.log('fileName: ' + colors.red(err.fileName));
    // gutil.log('lineNumber: ' + colors.red(err.lineNumber));
    // gutil.log('message: ' + err.message);
    // gutil.log('plugin: ' + colors.red(err.plugin));
}

/* ---------- uglifyjs ----------- */

gulp.task('uglifyjs', function () {
    gulp.src('src/**/*.js')
        // .pipe(uglify())
        .pipe(gulp.dest('dist/'));
})

gulp.task('watchjs', function () {
    gulp.watch('src/**/*.js', function (ev) {
        var paths = watchPath(ev, 'src/', 'dist/');
        gutil.log(gutil.colors.green(ev.type) +
            ': ' + paths.srcPath + ' → ' + paths.distPath);

        // gulp.src(paths.srcPath)
        //     .pipe(uglify())
        //     .pipe(gulp.dest(paths.distDir));
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            //sourcemaps.init(),
            // uglify(),
            //sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ]);

        combined.on('error', handleError);
    });
})

/* ---------- minifycss ----------- */

gulp.task('minifycss', function () {
    gulp.src('src/**/*.css')
        // .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        // .pipe(minifycss())
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/'));
})

gulp.task('watchcss', function () {
    gulp.watch('src/**/*.css', function (ev) {
        var paths = watchPath(ev, 'src/', 'dist/');
        gutil.log(gutil.colors.green(ev.type) +
            ': ' + paths.srcPath + ' → ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(autoprefixer({
                browsers: 'last 2 versions'
            }))
            // .pipe(minifycss())
            .pipe(gulp.dest(paths.distDir));
    })
})

/* ---------- lessc ----------- */

gulp.task('lessc', function () {
    var combined = combiner.obj([
        gulp.src('src/less/**/*.less'),
        less(),
        autoprefixer({
            browsers: 'last 2 versions'
        }),
        // minifycss(),
        gulp.dest('dist/css')
    ]);
    combined.on('error', handleError);
    combined.on('finish', function () {
        gutil.log(gutil.colors.green('编译全部less文件完成'));
    })
})

gulp.task('watchless', function () {
    gulp.watch('src/less/**/*.less', function (ev) {
        // 判断全局less变量"global-variables.less"
        if (ev.path.match(/global-variables.less/ig)) {
            gulp.start('lessc');
        } else {
            var paths = watchPath(ev, 'src/less', 'dist/css');
            gutil.log(gutil.colors.green(ev.type) +
                ': ' + paths.srcPath + ' → ' + paths.distPath);

            var combined = combiner.obj([
                gulp.src(paths.srcPath),
                less(),
                autoprefixer({
                    browsers: 'last 2 versions'
                }),
                // minifycss(),
                gulp.dest(paths.distDir)
            ]);
            combined.on('error', handleError);
        }
    })
})

/* ---------- imagemin ----------- */

gulp.task('imagemin', function () {
    gulp.src('src/**/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/'))
})

gulp.task('watchimage', function () {
    gulp.watch('src/img/**/*.{png,jpg,gif,ico}', function (ev) {
        var paths = watchPath(ev, 'src/', 'dist/');
        gutil.log(gutil.colors.green(ev.type) +
            ': ' + paths.srcPath + ' → ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(paths.distDir));
    })
})

/* ---------- html ----------- */


gulp.task('html', function () {
    var combined = combiner.obj([
        gulp.src('src/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/'))
    ]);
    combined.on('error', handleError);
    combined.on('finish', function () {
        gutil.log(gutil.colors.green('编译全部html组件并整合完成'));
    })
})

gulp.task('watchhtmlonly', function () {
    gulp.watch('src/**/*.html', function (ev) {
        var paths = watchPath(ev, 'src/', 'dist/');
        gutil.log(gutil.colors.green(ev.type) +
            ': ' + paths.srcPath + ' → ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(gulp.dest(paths.distDir));
    })
})

gulp.task('watchhtml', function () {
    gulp.watch('src/**/*.html', function (ev) {
        var paths = watchPath(ev, 'src/', 'dist/');
        gutil.log(gutil.colors.green(ev.type) +
            ': ' + paths.srcPath + ' → ' + paths.distPath);

        gulp.start('html');
    })
})

gulp.task('default', ['watchjs', 'watchless', 'watchimage', 'watchhtml']);

gulp.task('build', ['uglifyjs', 'minifycss', 'lessc', 'imagemin', 'html'])