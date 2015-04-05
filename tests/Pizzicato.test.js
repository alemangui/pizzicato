describe('Pizzicato', function() {

	it('Should have a context object', function() {
		expect(typeof Pizzicato.context).toBe('object');
	});

	it('Should contain Sound', function() {
		expect(typeof Pizzicato.Sound).toBe('function');
	});

	it('Should contain Effects', function() {
		expect(typeof Pizzicato.Effects).toBe('object');
	});

	it('Should contain Util', function() {
		expect(typeof Pizzicato.Util).toBe('object');
	});

	it('Should have \'Pz\' as alias', function() {
		expect(Pz).toBe(Pizzicato);
	});
});