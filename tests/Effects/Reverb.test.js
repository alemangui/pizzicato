describe('Effects.Reverb', function() {

	it('Should override default options', function() {
		var options = {
			mix: 0
		};
		var reverb = new Pizzicato.Effects.Reverb(options);

		expect(reverb.mix).toBe(options.mix);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			mix: -100000
		};

		var reverb = new Pizzicato.Effects.Reverb(options);

		expect(reverb.mix).toBe(0.5);
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