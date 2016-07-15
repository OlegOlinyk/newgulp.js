const gulp = require('gulp');
const wiredep = require('wiredep').stream;//компоненты bower
const useref = require('gulp-useref');//сборка
const gulpif = require('gulp-if');//фильтрацыя подключонных файло
const uglify = require('gulp-uglify');//минификація js
const minifyCss = require('gulp-minify-css');//минификацыя css
const clean = require('gulp-clean');//удаление не нужных файлов
const sftp = require('gulp-sftp');//отправка на сервер
const autoprefixer = require('gulp-autoprefixer');//автопрефиксы
const livereload = require('gulp-livereload');
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const uncss = require('gulp-uncss');

gulp.task('default', ['buld', 'img', 'fonts', 'style', 'bower']);
gulp.task('dev', ['buld', 'img', 'fonts', 'style', 'bower', 'watch']);

//connect
gulp.task('connect',  function() {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

//clean
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});
//SGTP
gulp.task('sftp', function () {
    return gulp.src('src/*')
        .pipe(sftp({
            host: 'website.com',
            user: 'johndoe',
            pass: '1234'
        }));
});
//build
gulp.task('build', ['clean'], function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});
//img
gulp.task('img', function() {
    return gulp.src('app/img/**/*.*')
        .pipe(gulp.dest('dist/img'));
});

//fonts
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
});
//style
gulp.task('style', function () {
   gulp.src('app/**/*.scss')
       .pipe(sass().on('error', sass.logError))
       .pipe(uncss({
           html: ['app/*.html']
       }))
       .pipe(autoprefixer())
       .pipe(gulp.dest('app'));
});

//bower
gulp.task('bower', function () {
    gulp.src('./app/index.html')
        .pipe(wiredep({
           directory : "app/bower_components"
        }))
        .pipe(gulp.dest('./app'));
});

gulp.task('watch', function () {
    gulp.watch('bower.json', ['bower']);
    gulp.watch('./src/fonts/**/*.*', ['fonts']);
    gulp.watch('./src/img/**/*.*', ['img']);
    gulp.watch('app/**/*.*', ['clean'], ['style'], ['build'], ['img'], ['fonts'])
});