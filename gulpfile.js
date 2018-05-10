var gulp = require('gulp'),// 載入後可使用gulp功能 ex.gulp.task、gulp.watch
    watch = require('gulp-watch'),//gulp watcher
    connect = require('gulp-connect'),//Gulp plugin to run a webserver (with LiveReload)
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),//Prevent pipe breaking caused by errors from gulp 
    runsequence = require('gulp-run-sequence'),
    gulpif = require('gulp-if'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat');

var isDev = false;
var port = 1945;

gulp.task('html', function () {
    console.log('start BEAUTIFY-HTML')
    let htmlbeautify = require('gulp-html-beautify'),
        options = {
            "indent_size": 4
        };
    gulp.src('example/*.html')
        .pipe(htmlbeautify(options))
        .pipe(gulp.dest('example/'))
            .pipe(connect.reload())
});

gulp.task('js', function () {
    let uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),    
        babel = require('gulp-babel');
    gulp.src('src/*.js')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(babel({
            "presets": ["es2015"],
            "plugins": ["transform-object-assign"]
        }))
        // .pipe(concat('app.js'))
        .pipe(uglify()) // uglify js
        .pipe(rename({ 
          suffix :'.min'
        }))
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload())
});

//Sever
gulp.task('connectDist', function () {
    connect.server({
        root: 'example',
        port: port,
        livereload: true
    });
});


// Watch
gulp.task('watch', function () {
    gulp.watch(['src/js/**'], ['js']);
});

//Build
gulp.task('build', function (cd) {
    runsequence(['html', 'js'], cd);
});

//Group Dev
gulp.task('dev', function (cd) {
    isDev = true;
    runsequence(['html', 'js', 'connectDist'], 'watch' ,cd);
 });

//Default  Task
gulp.task('default', ['dev'], function () {
    // 可透過default先載入
});
