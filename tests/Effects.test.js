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

});