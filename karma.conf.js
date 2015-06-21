module.exports = function(config) {

	var cfg = {
 
		browsers: ['Chrome'],

		customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    
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
	};

	if (process.env.TRAVIS)
    cfg.browsers = ['Chrome_travis_ci'];

	config.set(cfg);

};