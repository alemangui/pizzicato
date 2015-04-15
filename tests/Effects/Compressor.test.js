describe('Effects.Compressor', function() {

	it('Should override default options', function() {
		var options = {
			threshold: -25,
			knee: 33,
			attack: 0.005,
			release: 0.299
		};

		var compressor = new Pizzicato.Effects.Compressor(options);

		expect(compressor.threshold).toBe(options.threshold);
		expect(compressor.knee).toBe(options.knee);
		expect(compressor.attack).toBeCloseTo(options.attack);
		expect(compressor.release).toBeCloseTo(options.release);
	});

});