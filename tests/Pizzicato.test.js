describe('Pizzicato', function() {

	it('Should have a master gain node', function() {
		var masterGainNode = Pizzicato.masterGainNode;
		expect(masterGainNode.toString()).toContain('[object GainNode]');
	});

	it('Should have a volume property which controls the master gain node', function() {
		var masterGainNode = Pizzicato.masterGainNode;
		expect(masterGainNode.gain.value).toBe(1);

		Pizzicato.volume = 0.5;
		expect(masterGainNode.gain.value).toBeCloseTo(0.5);
	});

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