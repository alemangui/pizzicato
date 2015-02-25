module.exports = function(config) {

	config.set({
 
		browsers: ['Chrome'],
		frameworks: ['jasmine'],
		files: [
			'distr/Pizzicato.js',
			'tests/Tests.js'
		]

	});

};