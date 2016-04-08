'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    awsPublish = require('gulp-awspublish');

gulp.task('sass', function(){
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'));
});

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'src'
        },
    });
});

gulp.task('jshint', function (){
    return gulp.src('src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', ['browserSync', 'sass'], function(){
    gulp.watch('src/scss/**/*.scss', ['sass', browserSync.reload]);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', ['jshint', browserSync.reload]);
});

gulp.task('useref', function(){
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('build'));
});

gulp.task('clean:build', function() {
  return del.sync('build');
});

gulp.task('build', function(callback){
    runSequence('clean:build', 'sass', 'jshint', 'useref', callback);
});

gulp.task('publish:aws', function() {
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
    // https://console.aws.amazon.com/iam/home?region=us-west-2#security_credential
    var publisher = awsPublish.create({
        params: {
          Bucket: gutil.env.bucket
        },
        'accessKeyId': gutil.env.key,
        'secretAccessKey': gutil.env.secret
    });

    return gulp.src('build/**')
        .pipe(publisher.publish())
        .pipe(publisher.sync())
        .pipe(awsPublish.reporter());
});

gulp.task('default', ['watch']);

