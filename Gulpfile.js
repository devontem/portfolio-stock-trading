var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('./client/assets/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client/assets/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./client/assets/css/*.scss', ['sass']);
});
