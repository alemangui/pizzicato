describe('Effects.Panner', function() {

	it('Should override default options', function() {
		var options = {
			pan: 0.5
		};
		var panner = new Pizzicato.Effects.Panner(options);

		expect(panner.pan).toBe(options.pan);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			pan: 1.9
		};

		var panner = new Pizzicato.Effects.Panner(options);

		expect(panner.pan).toBe(0);
	});


	it('Should change the panner node pan value when changing the pan', function() {
		var initialPan = -0.3;
		var newPan = 0.5;
		var panner = new Pizzicato.Effects.Panner({ pan: initialPan });

		expect(panner.pannerNode.pan.value).toBeCloseTo(initialPan);

		panner.pan = newPan;

		expect(panner.pannerNode.pan.value).toBeCloseTo(newPan);
	});

});