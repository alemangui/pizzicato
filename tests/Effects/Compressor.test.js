describe('Effects.Compressor', function() {

	it('Should override default options', function() {
		var options = {
			threshold: -25,
			knee: 33,
			attack: 0.005,
			release: 0.299,
			ratio: 13
		};

		var compressor = new Pizzicato.Effects.Compressor(options);

		expect(compressor.threshold).toBe(options.threshold);
		expect(compressor.knee).toBe(options.knee);
		expect(compressor.attack).toBeCloseTo(options.attack);
		expect(compressor.release).toBeCloseTo(options.release);
		expect(compressor.ratio).toBeCloseTo(options.ratio);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			threshold: null,
			knee: undefined,
			attack: {},
			release: 'invalid',
			ratio: -1000000
		};

		var compressor = new Pizzicato.Effects.Compressor(options);

		expect(compressor.threshold).toBe(-24);
		expect(compressor.knee).toBe(30);
		expect(compressor.attack).toBeCloseTo(0.003);
		expect(compressor.release).toBeCloseTo(0.250);
		expect(compressor.ratio).toBeCloseTo(12);
	});


	it('Should change the threshold node values when changing the threshold property', function() {
		var initialThreshold = -30;
		var newThreshold = -60;
		var compressor = new Pizzicato.Effects.Compressor({ threshold: initialThreshold });

		expect(compressor.compressorNode.threshold.value).toBe(initialThreshold);

		compressor.threshold = newThreshold;

		expect(compressor.compressorNode.threshold.value).toBe(newThreshold);
	});


	it('Should not allow setting an invalid value as threshold', function() {
		var initialThreshold = -30;
		var compressor = new Pizzicato.Effects.Compressor({ threshold: initialThreshold });

		compressor.threshold = 20;
		expect(compressor.compressorNode.threshold.value).toBe(initialThreshold);

		compressor.threshold = null;
		expect(compressor.compressorNode.threshold.value).toBe(initialThreshold);

		compressor.threshold = undefined;
		expect(compressor.compressorNode.threshold.value).toBe(initialThreshold);

		compressor.threshold = 'hello';
		expect(compressor.compressorNode.threshold.value).toBe(initialThreshold);

		compressor.threshold = {};
		expect(compressor.compressorNode.threshold.value).toBe(initialThreshold);

		compressor.threshold = -101;
		expect(compressor.compressorNode.threshold.value).toBe(initialThreshold);

		compressor.threshold = -100;
		expect(compressor.compressorNode.threshold.value).toBe(-100);

		compressor.threshold = 0;
		expect(compressor.compressorNode.threshold.value).toBe(0);
	});


	it('Should change the knee node values when changing the knee property', function() {
		var initialKnee = 20;
		var newKnee = 22;
		var compressor = new Pizzicato.Effects.Compressor({ knee: initialKnee });

		expect(compressor.compressorNode.knee.value).toBe(initialKnee);

		compressor.knee = newKnee;

		expect(compressor.compressorNode.knee.value).toBe(newKnee);
	});


	it('Should not allow setting an invalid value as knee', function() {
		var initialKnee = 20;
		var compressor = new Pizzicato.Effects.Compressor({ knee: initialKnee });

		compressor.knee = 20;
		expect(compressor.compressorNode.knee.value).toBe(initialKnee);

		compressor.knee = null;
		expect(compressor.compressorNode.knee.value).toBe(initialKnee);

		compressor.knee = undefined;
		expect(compressor.compressorNode.knee.value).toBe(initialKnee);

		compressor.knee = 'hello';
		expect(compressor.compressorNode.knee.value).toBe(initialKnee);

		compressor.knee = {};
		expect(compressor.compressorNode.knee.value).toBe(initialKnee);

		compressor.knee = -101;
		expect(compressor.compressorNode.knee.value).toBe(initialKnee);

		compressor.knee = 0;
		expect(compressor.compressorNode.knee.value).toBe(0);

		compressor.knee = 40;
		expect(compressor.compressorNode.knee.value).toBe(40);
	});


	it('Should change the attack node values when changing the attack property', function() {
		var initialAttack = 0.5;
		var newAttack = 0.004;
		var compressor = new Pizzicato.Effects.Compressor({ attack: initialAttack });

		expect(compressor.compressorNode.attack.value).toBeCloseTo(initialAttack);

		compressor.attack = newAttack;

		expect(compressor.compressorNode.attack.value).toBeCloseTo(newAttack);
	});


	it('Should not allow setting an invalid value as attack', function() {
		var initialAttack = 0.45;
		var compressor = new Pizzicato.Effects.Compressor({ attack: initialAttack });

		compressor.attack = 20;
		expect(compressor.compressorNode.attack.value).toBeCloseTo(initialAttack);

		compressor.attack = null;
		expect(compressor.compressorNode.attack.value).toBeCloseTo(initialAttack);

		compressor.attack = undefined;
		expect(compressor.compressorNode.attack.value).toBeCloseTo(initialAttack);

		compressor.attack = 'hello';
		expect(compressor.compressorNode.attack.value).toBeCloseTo(initialAttack);

		compressor.attack = {};
		expect(compressor.compressorNode.attack.value).toBeCloseTo(initialAttack);

		compressor.attack = -101;
		expect(compressor.compressorNode.attack.value).toBeCloseTo(initialAttack);

		compressor.attack = 0;
		expect(compressor.compressorNode.attack.value).toBeCloseTo(0);

		compressor.attack = 1;
		expect(compressor.compressorNode.attack.value).toBeCloseTo(1);
	});


	it('Should change the release node values when changing the release property', function() {
		var initialRelease = 0.24;
		var newRelease = 0.4;
		var compressor = new Pizzicato.Effects.Compressor({ release: initialRelease });

		expect(compressor.compressorNode.release.value).toBeCloseTo(initialRelease);

		compressor.release = newRelease;

		expect(compressor.compressorNode.release.value).toBeCloseTo(newRelease);
	});


	it('Should not allow setting an invalid value as release', function() {
		var initialRelease = 0.45;
		var compressor = new Pizzicato.Effects.Compressor({ release: initialRelease });

		compressor.release = 20;
		expect(compressor.compressorNode.release.value).toBeCloseTo(initialRelease);

		compressor.release = null;
		expect(compressor.compressorNode.release.value).toBeCloseTo(initialRelease);

		compressor.release = undefined;
		expect(compressor.compressorNode.release.value).toBeCloseTo(initialRelease);

		compressor.release = 'hello';
		expect(compressor.compressorNode.release.value).toBeCloseTo(initialRelease);

		compressor.release = {};
		expect(compressor.compressorNode.release.value).toBeCloseTo(initialRelease);

		compressor.release = -101;
		expect(compressor.compressorNode.release.value).toBeCloseTo(initialRelease);

		compressor.release = 0;
		expect(compressor.compressorNode.release.value).toBeCloseTo(0);

		compressor.release = 1;
		expect(compressor.compressorNode.release.value).toBeCloseTo(1);
	});


	it('Should change the ratio node values when changing the ratio property', function() {
		var initialRatio = 3;
		var newRatio = 13;
		var compressor = new Pizzicato.Effects.Compressor({ ratio: initialRatio });

		expect(compressor.compressorNode.ratio.value).toBe(initialRatio);

		compressor.ratio = newRatio;

		expect(compressor.compressorNode.ratio.value).toBe(newRatio);
	});


	it('Should not allow setting an invalid value as ratio', function() {
		var initialRatio = 20;
		var compressor = new Pizzicato.Effects.Compressor({ ratio: initialRatio });

		compressor.ratio = 30;
		expect(compressor.compressorNode.ratio.value).toBe(initialRatio);

		compressor.ratio = null;
		expect(compressor.compressorNode.ratio.value).toBe(initialRatio);

		compressor.ratio = undefined;
		expect(compressor.compressorNode.ratio.value).toBe(initialRatio);

		compressor.ratio = 'hello';
		expect(compressor.compressorNode.ratio.value).toBe(initialRatio);

		compressor.ratio = {};
		expect(compressor.compressorNode.ratio.value).toBe(initialRatio);

		compressor.ratio = -101;
		expect(compressor.compressorNode.ratio.value).toBe(initialRatio);

		compressor.ratio = 1;
		expect(compressor.compressorNode.ratio.value).toBe(1);

		compressor.ratio = 10;
		expect(compressor.compressorNode.ratio.value).toBe(10);
	});

});