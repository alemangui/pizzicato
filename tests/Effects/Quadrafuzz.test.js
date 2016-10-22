describe('Effects.Quadrafuzz', function() {

	it('Should override default options', function() {
		var options = {
			lowGain: 0.1,
			midLowGain: 0.1,
			midHighGain: 0.1,
			highGain: 0.1
		};
		var quadrafuzz = new Pizzicato.Effects.Quadrafuzz(options);

		expect(quadrafuzz.lowGain).toBe(options.lowGain);
		expect(quadrafuzz.midLowGain).toBe(options.midLowGain);
		expect(quadrafuzz.midHighGain).toBe(options.midHighGain);
		expect(quadrafuzz.highGain).toBe(options.highGain);
	});


	it('should choose default options if invalid parameters are passed', function() {
		var options = {
			lowGain: 'low',
			midLowGain: -11,
			midHighGain: null,
			highGain: {}
		};

		var quadrafuzz = new Pizzicato.Effects.Quadrafuzz(options);

		expect(quadrafuzz.lowGain).toBe(0.6);
		expect(quadrafuzz.midLowGain).toBe(0.8);
		expect(quadrafuzz.midHighGain).toBe(0.5);
		expect(quadrafuzz.highGain).toBe(0.6);
	});


	it('Should change only the low overdrive when changing lowGain', function() {
		var quadrafuzz = new Pizzicato.Effects.Quadrafuzz({ lowGain: 1.0 });

		var lowCurveHead = quadrafuzz.overdrives[0].curve[0];
		var midLowCurveHead = quadrafuzz.overdrives[1].curve[0];
		var midHighCurveHead = quadrafuzz.overdrives[2].curve[0];
		var highCurveHead = quadrafuzz.overdrives[3].curve[0];

		quadrafuzz.lowGain = 0.0;

		expect(quadrafuzz.overdrives[0].curve[0]).not.toBe(lowCurveHead);
		expect(quadrafuzz.overdrives[1].curve[0]).toBe(midLowCurveHead);
		expect(quadrafuzz.overdrives[2].curve[0]).toBe(midHighCurveHead);
		expect(quadrafuzz.overdrives[3].curve[0]).toBe(highCurveHead);
	});


	it('Should change only the midLow overdrive when changing midLowGain', function() {
		var quadrafuzz = new Pizzicato.Effects.Quadrafuzz({ midLowGain: 1.0 });

		var lowCurveHead = quadrafuzz.overdrives[0].curve[0];
		var midLowCurveHead = quadrafuzz.overdrives[1].curve[0];
		var midHighCurveHead = quadrafuzz.overdrives[2].curve[0];
		var highCurveHead = quadrafuzz.overdrives[3].curve[0];

		quadrafuzz.midLowGain = 0.0;

		expect(quadrafuzz.overdrives[0].curve[0]).toBe(lowCurveHead);
		expect(quadrafuzz.overdrives[1].curve[0]).not.toBe(midLowCurveHead);
		expect(quadrafuzz.overdrives[2].curve[0]).toBe(midHighCurveHead);
		expect(quadrafuzz.overdrives[3].curve[0]).toBe(highCurveHead);
	});


	it('Should change only the low overdrive when changing midHighGain', function() {
		var quadrafuzz = new Pizzicato.Effects.Quadrafuzz({ midHighGain: 1.0 });

		var lowCurveHead = quadrafuzz.overdrives[0].curve[0];
		var midLowCurveHead = quadrafuzz.overdrives[1].curve[0];
		var midHighCurveHead = quadrafuzz.overdrives[2].curve[0];
		var highCurveHead = quadrafuzz.overdrives[3].curve[0];

		quadrafuzz.midHighGain = 0.0;

		expect(quadrafuzz.overdrives[0].curve[0]).toBe(lowCurveHead);
		expect(quadrafuzz.overdrives[1].curve[0]).toBe(midLowCurveHead);
		expect(quadrafuzz.overdrives[2].curve[0]).not.toBe(midHighCurveHead);
		expect(quadrafuzz.overdrives[3].curve[0]).toBe(highCurveHead);
	});


	it('Should change only the low overdrive when changing highGain', function() {
		var quadrafuzz = new Pizzicato.Effects.Quadrafuzz({ highGain: 1.0 });

		var lowCurveHead = quadrafuzz.overdrives[0].curve[0];
		var midLowCurveHead = quadrafuzz.overdrives[1].curve[0];
		var midHighCurveHead = quadrafuzz.overdrives[2].curve[0];
		var highCurveHead = quadrafuzz.overdrives[3].curve[0];

		quadrafuzz.highGain = 0.0;

		expect(quadrafuzz.overdrives[0].curve[0]).toBe(lowCurveHead);
		expect(quadrafuzz.overdrives[1].curve[0]).toBe(midLowCurveHead);
		expect(quadrafuzz.overdrives[2].curve[0]).toBe(midHighCurveHead);
		expect(quadrafuzz.overdrives[3].curve[0]).not.toBe(highCurveHead);
	});
});