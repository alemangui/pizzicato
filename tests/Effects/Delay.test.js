describe('Effects.Delay', function() {

	it('Should override default options', function() {
		var options = {
			feedback: 0.9,
			time: 0.6,
			mix: 0
		};
		var delay = new Pizzicato.Effects.Delay(options);

		expect(delay.feedback).toBe(options.feedback);
		expect(delay.time).toBe(options.time);
		expect(delay.mix).toBe(options.mix);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			feedback: '0.9',
			time: null,
			mix: -100000
		};

		var delay = new Pizzicato.Effects.Delay(options);

		expect(delay.feedback).toBe(0.5);
		expect(delay.time).toBe(0.3);
		expect(delay.mix).toBe(0.5);
	});


	it('Should change the gain node values when changing the mix', function() {
		var initialMix = 0;
		var newMix = 0.5;
		var delay = new Pizzicato.Effects.Delay({ mix: initialMix });

		expect(delay.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(initialMix));
		expect(delay.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(initialMix));

		delay.mix = newMix;

		expect(delay.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(newMix));
		expect(delay.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(newMix));
	});


	it('Should change the delay node time values when changing the time', function() {
		var initialTime = 0.3;
		var newTime = 0.5;
		var delay = new Pizzicato.Effects.Delay({ time: initialTime });

		expect(delay.delayNode.delayTime.value).toBeCloseTo(initialTime);

		delay.time = newTime;

		expect(delay.delayNode.delayTime.value).toBeCloseTo(newTime);
	});


	it('Should change the feedback strength when changing the feedback', function() {
		var initialFeedback = 0.4;
		var newFeedback = 0.5;
		var delay = new Pizzicato.Effects.Delay({ feedback: initialFeedback });

		expect(delay.feedbackGainNode.gain.value).toBeCloseTo(initialFeedback);

		delay.feedback = newFeedback;

		expect(delay.feedbackGainNode.gain.value).toBeCloseTo(newFeedback);
	});

});