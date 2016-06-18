describe('Effects.PingPongDelay', function() {

	it('Should override default options', function() {
		var options = {
			feedback: 0.9,
			time: 0.6,
			mix: 0
		};
		var pingPongDelay = new Pizzicato.Effects.PingPongDelay(options);

		expect(pingPongDelay.feedback).toBe(options.feedback);
		expect(pingPongDelay.time).toBe(options.time);
		expect(pingPongDelay.mix).toBe(options.mix);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			feedback: '0.9',
			time: null,
			mix: -100000
		};

		var pingPongDelay = new Pizzicato.Effects.PingPongDelay(options);

		expect(pingPongDelay.feedback).toBe(0.5);
		expect(pingPongDelay.time).toBe(0.3);
		expect(pingPongDelay.mix).toBe(0.5);
	});


	it('Should change the gain node values when changing the mix', function() {
		var initialMix = 0;
		var newMix = 0.5;
		var pingPongDelay = new Pizzicato.Effects.PingPongDelay({ mix: initialMix });

		expect(pingPongDelay.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(initialMix));
		expect(pingPongDelay.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(initialMix));

		pingPongDelay.mix = newMix;

		expect(pingPongDelay.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(newMix));
		expect(pingPongDelay.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(newMix));
	});


	it('Should change the delay node time values when changing the time', function() {
		var initialTime = 0.3;
		var newTime = 0.5;
		var pingPongDelay = new Pizzicato.Effects.PingPongDelay({ time: initialTime });

		expect(pingPongDelay.delayNodeLeft.delayTime.value).toBeCloseTo(initialTime);
		expect(pingPongDelay.delayNodeRight.delayTime.value).toBeCloseTo(initialTime);

		pingPongDelay.time = newTime;

		expect(pingPongDelay.delayNodeLeft.delayTime.value).toBeCloseTo(newTime);
		expect(pingPongDelay.delayNodeRight.delayTime.value).toBeCloseTo(newTime);
	});


	it('Should change the feedback strength when changing the feedback', function() {
		var initialFeedback = 0.4;
		var newFeedback = 0.5;
		var pingPongDelay = new Pizzicato.Effects.PingPongDelay({ feedback: initialFeedback });

		expect(pingPongDelay.feedbackGainNode.gain.value).toBeCloseTo(initialFeedback);

		pingPongDelay.feedback = newFeedback;

		expect(pingPongDelay.feedbackGainNode.gain.value).toBeCloseTo(newFeedback);
	});

});