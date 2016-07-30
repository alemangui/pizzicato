describe('Effects.RingModulator', function() {

	it('Should override default options', function() {
		var options = {
			speed: 200,
			distortion: 4,
			mix: 0
		};
		var ringmod = new Pizzicato.Effects.RingModulator(options);

		expect(ringmod.distortion).toBe(options.distortion);
		expect(ringmod.speed).toBe(options.speed);
		expect(ringmod.mix).toBe(options.mix);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			speed: 'speed',
			distortion: -100,
			mix: null
		};
		var ringmod = new Pizzicato.Effects.RingModulator(options);

		expect(ringmod.distortion).toBe(1);
		expect(ringmod.speed).toBe(30);
		expect(ringmod.mix).toBe(0.5);
	});


	it('Should change the gain node values when changing the mix', function() {
		var initialMix = 0;
		var newMix = 0.5;
		var ringmod = new Pizzicato.Effects.RingModulator({ mix: initialMix });

		expect(ringmod.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(initialMix));
		expect(ringmod.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(initialMix));

		ringmod.mix = newMix;

		expect(ringmod.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(newMix));
		expect(ringmod.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(newMix));
	});


	it('Should change the vIn node frequency value when changing the speed', function() {
		var initialSpeed = 50;
		var newSpeed = 30;
		var ringmod = new Pizzicato.Effects.RingModulator({ speed: initialSpeed });

		expect(ringmod.vIn.frequency.value).toBeCloseTo(initialSpeed);

		ringmod.speed = newSpeed;

		expect(ringmod.vIn.frequency.value).toBeCloseTo(newSpeed);
	});


	it('Should change the h level of all DiodeNodes when changing the distortion', function() {
		var initialDistortion = 1;
		var newDistortion = 4;
		var ringmod = new Pizzicato.Effects.RingModulator({ distortion: initialDistortion });

		expect(ringmod.vInDiode1.h).toBeCloseTo(initialDistortion);
		expect(ringmod.vInDiode2.h).toBeCloseTo(initialDistortion);
		expect(ringmod.vcDiode3.h).toBeCloseTo(initialDistortion);
		expect(ringmod.vcDiode4.h).toBeCloseTo(initialDistortion);

		ringmod.distortion = newDistortion;

		expect(ringmod.vInDiode1.h).toBeCloseTo(newDistortion);
		expect(ringmod.vInDiode2.h).toBeCloseTo(newDistortion);
		expect(ringmod.vcDiode3.h).toBeCloseTo(newDistortion);
		expect(ringmod.vcDiode4.h).toBeCloseTo(newDistortion);
	});

});