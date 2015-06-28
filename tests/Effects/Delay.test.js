describe('Effects.Delay', function() {

	it('Should override default options', function() {
		var options = {
			repetitions: 10,
			time: 0.6,
			mix: 0
		};
		var delay = new Pizzicato.Effects.Delay(options);

		expect(delay.repetitions).toBe(options.repetitions);
		expect(delay.time).toBe(options.time);
		expect(delay.mix).toBe(options.mix);
	});


	it('Should change the gain node values when changing the mix', function() {
		var initialMix = 0;
		var newMix = 0.5;

		var delay = new Pizzicato.Effects.Delay({ mix: initialMix });

		expect(delay.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(0));
		expect(delay.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(0));

		delay.mix = newMix;

		expect(delay.dryGainNode.gain.value).toBeCloseTo(Pz.Util.getDryLevel(newMix));
		expect(delay.wetGainNode.gain.value).toBeCloseTo(Pz.Util.getWetLevel(newMix));
	});


	it('Should change the delay node time values when changing the time', function() {
		var initialTime = 0.3;
		var newTime = 0.5;
		var i;

		var delay = new Pizzicato.Effects.Delay({ time: initialTime });

		for (i = 0; i < delay.delayLoop.length; i++)
			expect(delay.delayLoop[i].delay.delayTime.value).toBeCloseTo(initialTime);

		delay.time = newTime;

		for (i = 0; i < delay.delayLoop.length; i++)
			expect(delay.delayLoop[i].delay.delayTime.value).toBeCloseTo(newTime);
	});


	it('Should change the times the delay is looped when changing the repetitions', function() {
		var initialRepetitions = 10;
		var newRepetitions = 5;

		var delay = new Pizzicato.Effects.Delay({ repetitions: initialRepetitions });
		expect(delay.delayLoop.length).toBe(10);

		delay.repetitions = newRepetitions;
		expect(delay.delayLoop.length).toBe(newRepetitions);
	});

});