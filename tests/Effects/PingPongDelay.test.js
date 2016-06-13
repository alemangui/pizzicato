describe('Effects.PingPongDelay', function() {

	it('Should override default options', function() {
		var options = {
			feedback: 0.9,
			time: 0.6,
			mix: 0
		};
		var pingpongdelay = new Pizzicato.Effects.PingPongDelay(options);

		expect(pingpongdelay.feedback).toBe(options.feedback);
		expect(pingpongdelay.time).toBe(options.time);
		expect(pingpongdelay.mix).toBe(options.mix);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			feedback: '0.9',
			time: null,
			mix: -100000
		};

		var pingpongdelay = new Pizzicato.Effects.PingPongDelay(options);

		expect(pingpongdelay.feedback).toBe(0.5);
		expect(pingpongdelay.time).toBe(0.3);
		expect(pingpongdelay.mix).toBe(0.5);
	});


	it('Should change the gain node values when changing the mix', function() {
		var initialMix = 0;
		var newMix = 0.5;
		var pingpongdelay = new Pizzicato.Effects.PingPongDelay({ mix: initialMix });

		expect(pingpongdelay.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(initialMix));
		expect(pingpongdelay.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(initialMix));

		pingpongdelay.mix = newMix;

		expect(pingpongdelay.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(newMix));
		expect(pingpongdelay.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(newMix));
	});


	it('Should change the delay node time values when changing the time', function() {
		var initialTime = 0.3;
		var newTime = 0.5;
		var pingpongdelay = new Pizzicato.Effects.PingPongDelay({ time: initialTime });

		expect(pingpongdelay.delayNodeLeft.delayTime.value).toBeCloseTo(initialTime);
		expect(pingpongdelay.delayNodeRight.delayTime.value).toBeCloseTo(initialTime);

		pingpongdelay.time = newTime;

		expect(pingpongdelay.delayNodeLeft.delayTime.value).toBeCloseTo(newTime);
		expect(pingpongdelay.delayNodeRight.delayTime.value).toBeCloseTo(newTime);
	});


	it('Should change the feedback strength when changing the feedback', function() {
		var initialFeedback = 0.4;
		var newFeedback = 0.5;
		var pingpongdelay = new Pizzicato.Effects.PingPongDelay({ feedback: initialFeedback });

		expect(pingpongdelay.feedbackGainNode.gain.value).toBeCloseTo(initialFeedback);

		pingpongdelay.feedback = newFeedback;

		expect(pingpongdelay.feedbackGainNode.gain.value).toBeCloseTo(newFeedback);
	});

});