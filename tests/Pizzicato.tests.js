describe('Pizzicato', function() {

	it('Should contain Sound', function() {
		expect(typeof Pizzicato.Sound).toBe('function');
	});

	it('Should contain Effect', function() {
		expect(typeof Pizzicato.Effect).toBe('function');
	});

	it('Should contain Util', function() {
		expect(typeof Pizzicato.Util).toBe('object');
	});

	it('Should have \'Pz\' as alias', function() {
		expect(Pz).toBe(Pizzicato);
	});
});


describe('Util', function() {

	it('contains a working isString function', function() {
		var isString = Pizzicato.Util.isString;

		expect(typeof isString).toBe('function');
		expect(isString('')).toBe(true);
		expect(isString()).toBe(false);
		expect(isString('hello')).toBe(true);
		expect(isString({ text: 'hello' })).toBe(false);
		expect(isString(function() { return 'hello'; })).toBe(false);
		expect(isString(42)).toBe(false);
	});

	it('contains a working isString function', function() {
		var isObject = Pizzicato.Util.isObject;

		expect(typeof isObject).toBe('function');
		expect(isObject('')).toBe(false);
		expect(isObject()).toBe(false);
		expect(isObject({ text: 'hello' })).toBe(true);
		expect(isObject({})).toBe(true);
		expect(isObject(function() { return {}; })).toBe(false);
		expect(isObject(42)).toBe(false);
	});

	it('contains a working isFunction function', function() {
		var isFunction = Pizzicato.Util.isFunction;

		expect(typeof isFunction).toBe('function');
		expect(isFunction('')).toBe(false);
		expect(isFunction()).toBe(false);
		expect(isFunction({ text: 'hello' })).toBe(false);
		expect(isFunction(function() { return {}; })).toBe(true);
		expect(isFunction(function() {})).toBe(true);
		expect(isFunction(42)).toBe(false);
	});
});


describe('Sound', function() {

	it('should create an AudioContext', function() {
		var sound = new Pizzicato.Sound();
		expect(toString.call(sound.context)).toBe('[object AudioContext]');
	});

	it('should create an oscillator mode when initialized with a wave option', function() {
		var sound = new Pizzicato.Sound({
			wave: { type: 'sine' }
		});
		expect(toString.call(sound.getSourceNode())).toBe('[object OscillatorNode]')
	});

	it('should execute callback function when given one', function(done) {
		var sound = new Pizzicato.Sound('base/tests/bird.wav', function() {
			done();
		});
	}, 5000);

	it('Pausing, playing and stopping should update the corresponding properties', function() {
		var sound = new Pizzicato.Sound('base/tests/bird.wav', function() {
			expect(sound.playing).toBe(false);
			expect(sound.paused).toBe(false);

			sound.play();
			expect(sound.playing).toBe(true);
			expect(sound.paused).toBe(false);
			
			sound.pause();
			expect(sound.playing).toBe(false);
			expect(sound.paused).toBe(true);

			sound.play();
			expect(sound.playing).toBe(true);
			expect(sound.paused).toBe(false);

			sound.stop();
			expect(sound.playing).toBe(false);
			expect(sound.paused).toBe(false);
		});
	});

});