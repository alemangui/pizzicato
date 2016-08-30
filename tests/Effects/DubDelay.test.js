describe('Effects.DubDelay', function() {

	it('Should override default options', function() {
		var options = {
			feedback: 0.9,
			time: 0.6,
			mix: 0,
			cutoff: 1600
		};
		var dubDelay = new Pizzicato.Effects.DubDelay(options);

		expect(dubDelay.feedback).toBe(options.feedback);
		expect(dubDelay.time).toBe(options.time);
		expect(dubDelay.mix).toBe(options.mix);
		expect(dubDelay.cutoff).toBe(options.cutoff);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			feedback: '0.9',
			time: null,
			mix: -100000,
			cutoff: 9000
		};

		var dubDelay = new Pizzicato.Effects.DubDelay(options);

		expect(dubDelay.feedback).toBe(0.6);
		expect(dubDelay.time).toBe(0.7);
		expect(dubDelay.mix).toBe(0.5);
		expect(dubDelay.cutoff).toBe(700);
	});


	it('Should change the gain node values when changing the mix', function() {
		var initialMix = 0;
		var newMix = 0.5;
		var dubDelay = new Pizzicato.Effects.DubDelay({ mix: initialMix });

		expect(dubDelay.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(initialMix));
		expect(dubDelay.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(initialMix));

		dubDelay.mix = newMix;

		expect(dubDelay.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(newMix));
		expect(dubDelay.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(newMix));
	});


	it('Should change the delay node time values when changing the time', function() {
		var initialTime = 0.3;
		var newTime = 0.5;
		var dubDelay = new Pizzicato.Effects.DubDelay({ time: initialTime });

		expect(dubDelay.delayNode.delayTime.value).toBeCloseTo(initialTime);

		dubDelay.time = newTime;

		expect(dubDelay.delayNode.delayTime.value).toBeCloseTo(newTime);
	});


	it('Should change the feedback strength when changing the feedback', function() {
		var initialFeedback = 0.4;
		var newFeedback = 0.5;
		var dubDelay = new Pizzicato.Effects.DubDelay({ feedback: initialFeedback });

		expect(dubDelay.feedbackGainNode.gain.value).toBeCloseTo(initialFeedback);

		dubDelay.feedback = newFeedback;

		expect(dubDelay.feedbackGainNode.gain.value).toBeCloseTo(newFeedback);
	});

	it('Should change the frequency value when changing the cutoff', function() {
		var initialFrequency = 2000;
		var newFrequency = 1600;
		var dubDelay = new Pizzicato.Effects.DubDelay({ cutoff: initialFrequency });

		expect(dubDelay.bqFilterNode.frequency.value).toBeCloseTo(initialFrequency);

		dubDelay.cutoff = newFrequency;

		expect(dubDelay.bqFilterNode.frequency.value).toBeCloseTo(newFrequency);
	});


});