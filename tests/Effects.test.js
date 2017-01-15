describe('Effects', function() {

	it('All effects must have an inputNode', function() {
		for (var key in Pizzicato.Effects) {
			var effect = new Pizzicato.Effects[key]();
			expect(effect.inputNode).toEqual(jasmine.any(AudioNode));
		}
	});


	it('All effects must have an outputNode', function() {
		for (var key in Pizzicato.Effects) {
			var effect = new Pizzicato.Effects[key]();
			expect(effect.outputNode).toEqual(jasmine.any(AudioNode));
		}
	});

	it('should be able to chain connect functions', function() {
		var analyser = Pz.context.createAnalyser();
		var gain = Pz.context.createGain();
		var delay = new Pz.Effects.Delay();

		var result = delay.connect(analyser).connect(gain);
		expect(result).toBe(delay);

		result = delay.disconnect(analyser).disconnect(gain);			
		expect(result).toBe(delay);
	});
});