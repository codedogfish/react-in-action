'use strict'

var config = require('./config.js');
var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var browserSync = require("browser-sync");

gulp.task('default', ['jsx'], function() {
    gulp.src(config.SRC_PATH + '/*.html').pipe(gulp.dest(config.DIST_PATH));
});

gulp.task('serve', ['default'], function() {
    browserSync({
        server: {
            baseDir: config.DIST_PATH,
            routes: {
                "/bower_components": "bower_components"
            }
        }
    });
    gulp.watch(config.SRC_PATH + '/**/*.*', ['watch']);
});

gulp.task('watch', ['jsx'], browserSync.reload)

gulp.task('jsx', function() {
    return gulp.src(config.SRC_PATH + '/**/*.jsx')
        .pipe($.react())
        .pipe(gulp.dest(config.DIST_PATH));
})
