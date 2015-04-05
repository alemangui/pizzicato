describe('Effects.Delay', function() {

	it('Should override default options', function(done) {
		var options = {
			repetitions: 10,
			time: 0.6,
			mix: 0.7
		};
		var delay = new Pizzicato.Effects.Delay(options);

		expect(delay.options.repetitions).toBe(options.repetitions);
		expect(delay.options.time).toBe(options.time);
		expect(delay.options.mix).toBe(options.mix);

		done();
	}, 5000);

});