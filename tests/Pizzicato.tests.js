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

	it('Contains a working isString function', function() {
		var isString = Pizzicato.Util.isString;

		expect(typeof isString).toBe('function');
		expect(isString('')).toBe(true);
		expect(isString()).toBe(false);
		expect(isString('hello')).toBe(true);
		expect(isString({ text: 'hello' })).toBe(false);
		expect(isString(function() { return 'hello'; })).toBe(false);
		expect(isString(42)).toBe(false);
	});

	it('Contains a working isString function', function() {
		var isObject = Pizzicato.Util.isObject;

		expect(typeof isObject).toBe('function');
		expect(isObject('')).toBe(false);
		expect(isObject()).toBe(false);
		expect(isObject({ text: 'hello' })).toBe(true);
		expect(isObject({})).toBe(true);
		expect(isObject(function() { return {}; })).toBe(false);
		expect(isObject(42)).toBe(false);
	});

	it('Contains a working isFunction function', function() {
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

	it('Should create an AudioContext', function() {
		var sound = new Pizzicato.Sound();
		expect(toString.call(sound.context)).toBe('[object AudioContext]');
	});
});