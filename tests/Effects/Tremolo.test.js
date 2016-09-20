describe('Effects.Tremelo', function() {

	it('Should override default options', function() {
		var options = {
			speed: 2,
			mix: 0
		};
		var tremolo = new Pizzicato.Effects.Tremolo(options);

		expect(tremolo.speed).toBe(options.speed);
		expect(tremolo.mix).toBe(options.mix);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			speed: 'Keanu Reeves',
			mix: -100000
		};

		var tremolo = new Pizzicato.Effects.Tremolo(options);

		expect(tremolo.speed).toBe(4);
		expect(tremolo.mix).toBe(0.8);
	});


	it('Should change the gain node values when changing the mix', function() {
		var initialMix = 0;
		var newMix = 0.5;
		var tremolo = new Pizzicato.Effects.Tremolo({ mix: initialMix });

		expect(tremolo.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(initialMix));
		expect(tremolo.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(initialMix));

		tremolo.mix = newMix;

		expect(tremolo.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(newMix));
		expect(tremolo.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(newMix));
	});


	it('Should change the oscillator node time values when changing the speed', function() {
		var initialSpeed = 4;
		var newSpeed = 8;
		var tremolo = new Pizzicato.Effects.Tremolo({ speed: initialSpeed });

		expect(tremolo.oscillator.frequency.value).toBeCloseTo(initialSpeed);

		tremolo.speed = newSpeed;

		expect(tremolo.oscillator.frequency.value).toBeCloseTo(newSpeed);
	});

});