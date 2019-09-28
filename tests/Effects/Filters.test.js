describe('Effects.Filters', function() {

	it('Should override default options', function() {
		var options = {
			frequency: 10,
			peak: 0.6,
			gain: 1.5
		};
		var lowPassFilter = new Pizzicato.Effects.LowPassFilter(options);

		expect(lowPassFilter.frequency).toBe(options.frequency);
		expect(lowPassFilter.peak).toBe(Math.fround(options.peak));
		expect(lowPassFilter.gain).toBe(options.gain);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			frequency: 1000000,
			peak: 'invalid',
			gain: 100500,
		};

		var highPassFilter = new Pizzicato.Effects.HighPassFilter(options);

		expect(highPassFilter.frequency).toBe(350);
		expect(highPassFilter.peak).toBe(1);	
		expect(highPassFilter.gain).toBe(0);	
	});


	it('Should change the filter node frequency value when changing the frequency', function() {
		var initialFrequency = 400;
		var newFrequency = 600;
		var lowPassFilter = new Pizzicato.Effects.LowPassFilter({ frequency: initialFrequency });

		expect(lowPassFilter.filterNode.frequency.value).toBe(initialFrequency);

		lowPassFilter.frequency = newFrequency;

		expect(lowPassFilter.filterNode.frequency.value).toBe(newFrequency);
	});


	it('Should change the filter node Q value when changing the peak', function() {
		var initialPeak = 5;
		var newPeak = 100;
		var highPassFilter = new Pizzicato.Effects.HighPassFilter({ peak: initialPeak });

		expect(highPassFilter.filterNode.Q.value).toBe(initialPeak);

		highPassFilter.peak = newPeak;

		expect(highPassFilter.filterNode.Q.value).toBe(newPeak);
	});


	it('Should change the filter node gain value when changing the gain', function() {
		var initialGain = 3.5;
		var newGain = 5;
		var notchFilter = new Pizzicato.Effects.NotchFilter({ gain: initialGain });

		expect(notchFilter.filterNode.gain.value).toBe(initialGain);

		notchFilter.gain = newGain;

		expect(notchFilter.filterNode.gain.value).toBe(newGain);
	});

});