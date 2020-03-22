var gulp = require('gulp');
var include = require('gulp-include');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var KarmaServer = require('karma').Server;

function hint() {
	return gulp.src('./src/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
};

function scripts() {
	return gulp.src('./src/Pizzicato.js')
		.pipe(include())
		.pipe(gulp.dest('./distr'))
		.pipe(gulp.dest('./site'))
		.pipe(rename('Pizzicato.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./distr'));
};

function test(done) {
	new KarmaServer({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
};

function watch() {
	gulp.watch(['./src/**/*.js'], gulp.series(hint, scripts));
};

gulp.task('build', gulp.series(hint, scripts))
gulp.task('test', gulp.series(hint, scripts, test))
gulp.task('watch', gulp.series(hint, scripts, watch))
