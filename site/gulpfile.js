var gulp = require('gulp');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');

gulp.task('webserver', function() {
  gulp.src('')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true,
      port: 8001,
      host: '0.0.0.0'
    }));
});

gulp.task('sass', function() {
  return gulp.src('scss/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass())
    .pipe(gulp.dest('css'))
})

gulp.task('watch', ['webserver', 'sass'], function (){
  // ... watchers
})
