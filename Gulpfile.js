var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var mocha = require('gulp-mocha');

// Sets up sass
gulp.task('sass', function () {
  return gulp.src('./client/assets/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client/assets/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./client/assets/css/*.scss', ['sass']);
});

// Sets up jshint
gulp.task('lint', function() {
  return gulp.src('./client/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Sets up Mocha for testing
gulp.task('test', function () {
	return gulp.src('test.js', {read: false})
		// gulp-mocha needs filepaths so you can't have any plugins before it
		.pipe(mocha({reporter: 'nyan'}));
});

gulp.task('concat', function() {
  return gulp.src(['client/**/*.js', '!client/bower_components{,/**}'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('client/dist/'));
});

gulp.task('concat:watch', function () {
  gulp.watch('client/**/*.js', ['concat']);
});
