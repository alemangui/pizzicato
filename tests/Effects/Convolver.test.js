describe('Effects.Convolver', function() {

	it('Should override default options', function() {
		var options = {
			mix: 0
		};
		var convolver = new Pizzicato.Effects.Convolver(options);

		expect(convolver.mix).toBe(options.mix);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			mix: -100000
		};

		var convolver = new Pizzicato.Effects.Convolver(options);

		expect(convolver.mix).toBe(0.5);
	});


	it('Should change the gain node values when changing the mix', function() {
		var initialMix = 0;
		var newMix = 0.5;
		var convolver = new Pizzicato.Effects.Convolver({ mix: initialMix });

		expect(convolver.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(initialMix));
		expect(convolver.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(initialMix));

		convolver.mix = newMix;

		expect(convolver.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(newMix));
		expect(convolver.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(newMix));
	});

});