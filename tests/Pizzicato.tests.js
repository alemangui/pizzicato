describe('Pizzicato', function() {

	it('Should contain Sound', function() {
		expect(typeof Pizzicato.Sound).toBe('function');
	});

	it('Should contain Effect', function() {
		expect(typeof Pizzicato.Effect).toBe('function');
	});

});