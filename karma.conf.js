module.exports = function(config) {

	config.set({
 
		browsers: ['Chrome'],
		frameworks: ['jasmine'],
		files: [
			'distr/Pizzicato.js',
			'tests/**/*.js',
      { 
      	pattern:  'tests/*.wav',
        watched:  false,
        served:   true,
        included: false 
      }
		]

	});

};