describe('Effects.Tremolo', function() {

	it('Should override default options', function() {
		var options = {
			speed: 2,
			mix: 0,
			depth: 0.4
		};
		var tremolo = new Pizzicato.Effects.Tremolo(options);

		expect(tremolo.speed).toBe(options.speed);
		expect(tremolo.mix).toBe(options.mix);
		expect(tremolo.depth).toBe(options.depth);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			speed: 'Keanu Reeves',
			mix: -100000,
			depth: 'charge',
		};

		var tremolo = new Pizzicato.Effects.Tremolo(options);

		expect(tremolo.speed).toBe(4);
		expect(tremolo.depth).toBe(1);
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


	it('Should change the LFO node time values when changing the speed', function() {
		var initialSpeed = 4;
		var newSpeed = 8;
		var tremolo = new Pizzicato.Effects.Tremolo({ speed: initialSpeed });

		expect(tremolo.lfoNode.frequency.value).toBeCloseTo(initialSpeed);

		tremolo.speed = newSpeed;

		expect(tremolo.lfoNode.frequency.value).toBeCloseTo(newSpeed);
	});

	it('Should change the tremolo gain node value when changing the depth', function() {
		var initialDepth = 0.4;
		var newDepth = 0.9;
		var tremolo = new Pizzicato.Effects.Tremolo({ depth: initialDepth });

		expect(tremolo.shaperNode.curve[0]).toBeCloseTo(1 - initialDepth);

		tremolo.depth = newDepth;

		expect(tremolo.shaperNode.curve[0]).toBeCloseTo(1- newDepth);
	});

});