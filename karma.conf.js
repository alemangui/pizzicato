module.exports = function(config) {

	var cfg = {
 
		browsers: ['Firefox'],
		frameworks: ['jasmine'],
		browserNoActivityTimeout: 30000,
		files: [
			'distr/Pizzicato.js',
			'tests/**/*.js',
			{ 
				pattern:  'tests/*.*',
				watched:  false,
				served:   true,
				included: false 
			}
		]
	};

	config.set(cfg);

};