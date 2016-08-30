var gulp = require('gulp');
var include = require('gulp-include');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var KarmaServer = require('karma').Server;


gulp.task('hint', function() {
	var stream = gulp.src('./src/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));

	return stream;
});


gulp.task('scripts', ['hint'], function() {
	var stream = gulp.src('./src/Pizzicato.js')
		.pipe(include())
		.pipe(gulp.dest('./distr'))
		.pipe(gulp.dest('./site'))
		.pipe(rename('Pizzicato.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./distr'));

	return stream;
});


gulp.task('test', ['scripts'], function(done) {
	new KarmaServer({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
})

gulp.task('watch', ['scripts'], function() {
	gulp.watch(['./src/**/*.js'], ['scripts']);
});

gulp.task('default', ['hint', 'scripts', 'test']);