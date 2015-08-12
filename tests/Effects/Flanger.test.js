describe('Effects.Flanger', function() {

	it('Should override default options', function() {
		var options = {
			time: 0.8,
			speed: 0.9,
			depth: 0.2,
			feedback: 0.6,
			mix: 0.5
		};
		var flanger = new Pizzicato.Effects.Flanger(options);

		expect(flanger.time).toBe(options.time);
		expect(flanger.speed).toBe(options.speed);
		expect(flanger.depth).toBe(options.depth);
		expect(flanger.feedback).toBe(options.feedback);
		expect(flanger.mix).toBe(options.mix);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			time: null,
			speed: 'invalid',
			depth: 1000000,
			feedback: 1000000,
			mix: -1000000
		};

		var flanger = new Pizzicato.Effects.Flanger(options);

		expect(flanger.time).toBe(0.45);
		expect(flanger.speed).toBe(0.2);
		expect(flanger.depth).toBe(0.1);
		expect(flanger.feedback).toBe(0.1);
		expect(flanger.mix).toBe(0.5);
	});


	it('Should modify the delay node time when changing the time', function() {
		var initialTime = 0.2;
		var newTime = 0.3;
		var floor = 0.001;
		var ceil = 0.02;

		var flanger = new Pizzicato.Effects.Flanger({ time: initialTime })

		expect(flanger.delayNode.delayTime.value).toBeCloseTo(Pz.Util.normalize(initialTime, floor, ceil));

		flanger.time = newTime;

		expect(flanger.delayNode.delayTime.value).toBeCloseTo(Pz.Util.normalize(newTime, floor, ceil));
	});


	it('Should modify the oscillator frequency when modifying the speed', function() {
		var initialSpeed = 0.6;
		var newSpeed = 0.7;
		var floor = 0.5;
		var ceil = 5;

		var flanger = new Pizzicato.Effects.Flanger({ speed: initialSpeed })

		expect(flanger.oscillatorNode.frequency.value).toBeCloseTo(Pz.Util.normalize(initialSpeed, floor, ceil));

		flanger.speed = newSpeed;

		expect(flanger.oscillatorNode.frequency.value).toBeCloseTo(Pz.Util.normalize(newSpeed, floor, ceil));
	});


	it('Should modify the gain node when modifying the depth', function() {
		var initialDepth = 0.2;
		var newDepth = 0.3;
		var floor = 0.0005;
		var ceil = 0.005;

		var flanger = new Pizzicato.Effects.Flanger({ depth: initialDepth })

		expect(flanger.gainNode.gain.value).toBeCloseTo(Pz.Util.normalize(initialDepth, floor, ceil));

		flanger.depth = newDepth;

		expect(flanger.gainNode.gain.value).toBeCloseTo(Pz.Util.normalize(newDepth, floor, ceil));
	});


	it('Should modify the feedback node when modifying the feedback', function() {
		var initialFeedback = 0.1;
		var newFeedback = 0.3;
		var floor = 0;
		var ceil = 0.8;

		var flanger = new Pizzicato.Effects.Flanger({ feedback: initialFeedback })

		expect(flanger.feedbackNode.gain.value).toBeCloseTo(Pz.Util.normalize(initialFeedback, floor, ceil));

		flanger.feedback = newFeedback;

		expect(flanger.feedbackNode.gain.value).toBeCloseTo(Pz.Util.normalize(newFeedback, floor, ceil));
	});

	it('Should change the gain node values when changing the mix', function() {
		var initialMix = 0;
		var newMix = 0.5;
		var flanger = new Pizzicato.Effects.Flanger({ mix: initialMix });

		expect(flanger.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(initialMix));
		expect(flanger.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(initialMix));

		flanger.mix = newMix;

		expect(flanger.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(newMix));
		expect(flanger.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(newMix));
	});

});