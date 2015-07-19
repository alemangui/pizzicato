describe('Effects.Distortion', function() {


	it('should override default options', function() {
		var options = { gain: 0.8 };
		var distortion = new Pizzicato.Effects.Distortion(options);

		expect(distortion.gain).toBe(options.gain);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			gain: null
		};

		var distortion = new Pizzicato.Effects.Distortion(options);

		expect(distortion.gain).toBe(0.5);
	});


	it('should create a waveShaperNode', function() {
		var distortion = new Pizzicato.Effects.Distortion();

		expect(distortion.waveShaperNode).not.toBe(undefined);
	});


	it('should change the waveShaperNode\'s curve when modifying the gain', function() {
		var distortion = new Pizzicato.Effects.Distortion();
		var initialCurve = distortion.waveShaperNode.curve;
		
		distortion.gain = 0.9;
		expect(distortion.waveShaperNode.curve).not.toEqual(initialCurve);
	});
});