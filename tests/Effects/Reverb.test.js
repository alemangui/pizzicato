describe('Effects.Reverb', function() {

	it('Should override default options', function() {
		var options = {
			mix: 0,
			decay: 7,
			time: 10,
			reverse: true
		};
		var reverb = new Pizzicato.Effects.Reverb(options);

		expect(reverb.mix).toEqual(options.mix);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			mix: -100000,
			decay: 'tooth',
			time: 'Rock Hudson movie',
			reverse: 1
		};

		var defaults = {
			mix: 0.5,
			time: 0.01,
			decay: 0.01,
			reverse: false
		};


		var reverb = new Pizzicato.Effects.Reverb(options);

		expect(reverb.mix).toBe(defaults.mix);
		expect(reverb.reverse).toBeFalsy();
		expect(reverb.time).toBe(defaults.time);
		expect(reverb.decay).toBe(defaults.decay);

	});

	it('Should modify the decay when changed', function() {
		var initialDecay = 0.8;
		var newDecay = 0.3;
		var reverb = new Pizzicato.Effects.Reverb({ decay: initialDecay });

		expect(reverb.decay).toEqual(initialDecay);

		reverb.decay = newDecay;

		expect(reverb.decay).toEqual(newDecay);
	});

	it('Should modify the time when changed', function() {
		var initialTime = 0.8;
		var newTime = 0.3;
		var reverb = new Pizzicato.Effects.Reverb({ time: initialTime });

		expect(reverb.time).toEqual(initialTime);

		reverb.time = newTime;

		expect(reverb.time).toEqual(newTime);
	});

	it('Should modify the reverse when changed', function() {
		var initialReverse = false;
		var newReverse = true;
		var reverb = new Pizzicato.Effects.Reverb({ reverse: initialReverse });

		expect(reverb.reverse).toEqual(initialReverse);

		reverb.reverse = newReverse;

		expect(reverb.reverse).toEqual(newReverse);
	});



	it('Should change the gain node values when changing the mix', function() {
		var initialMix = 0;
		var newMix = 0.5;
		var reverb = new Pizzicato.Effects.Reverb({ mix: initialMix });

		expect(reverb.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(initialMix));
		expect(reverb.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(initialMix));

		reverb.mix = newMix;

		expect(reverb.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(newMix));
		expect(reverb.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(newMix));
	});

});