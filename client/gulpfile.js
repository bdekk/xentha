var gulp = require('gulp');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

gulp.task('webserver', function() {
  gulp.src('')
    .pipe(webserver({
      livereload: true,
      open: true,
      host: '0.0.0.0'
    }));
});

gulp.task('sass', function() {
  return gulp.src('./scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'))
    .pipe(connect.reload());
})

gulp.task('watch', ['webserver', 'sass'], function (){
  // ... watchers
})
