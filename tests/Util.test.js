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


	it('contains a working isObject function', function() {
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


	it('contains a working isNumber function', function() {
		var isNumber = Pizzicato.Util.isNumber;

		expect(typeof isNumber).toBe('function');
		expect(isNumber('')).toBe(false);
		expect(isNumber(NaN)).toBe(false);
		expect(isNumber({ text: 'hello' })).toBe(false);
		expect(isNumber(0)).toBe(true);
		expect(isNumber(0.43)).toBe(true);
		expect(isNumber(42)).toBe(true);
		expect(isNumber(-42)).toBe(true);
	});


	it('contains a working isBool function', function() {
		var isBool = Pizzicato.Util.isBool;

		expect(typeof isBool).toBe('function');
		expect(isBool('')).toBeFalsy();
		expect(isBool(true)).toBeTruthy();
		expect(isBool({ text: 'hello' })).toBeFalsy();
		expect(isBool(false)).toBeTruthy();
		expect(isBool('true')).toBeFalsy();
		expect(isBool('True')).toBeFalsy();
	});


	it('contains a working isInRange function', function() {
		var isInRange = Pizzicato.Util.isInRange;

		expect(typeof isInRange).toBe('function');
		expect(isInRange('', 0, 1)).toBe(false);
		expect(isInRange(NaN, 0, 1)).toBe(false);
		expect(isInRange({ text: 'hello' })).toBe(false);
		expect(isInRange(0, 0, 1)).toBe(true);
		expect(isInRange(0.43, 0, 1)).toBe(true);
		expect(isInRange(42, 10, 20)).toBe(false);
		expect(isInRange(-42, -43, 0)).toBe(true);
	});

	it('contains a working isOscillator function', function() {
		var context = new window.AudioContext();
		var oscillatorNode = context.createOscillator();
		var pannerNode = context.createPanner();
		var isOscillator = Pizzicato.Util.isOscillator;

		expect(isOscillator(oscillatorNode)).toBe(true);
		expect(isOscillator(pannerNode)).toBe(false);
	});


	it('contains a working isAudioBufferSourceNode function', function() {
		var context = new window.AudioContext();
		var bufferNode = context.createBufferSource();
		var pannerNode = context.createPanner();
		var isAudioBufferSourceNode = Pizzicato.Util.isAudioBufferSourceNode;

		expect(isAudioBufferSourceNode(bufferNode)).toBe(true);
		expect(isAudioBufferSourceNode(pannerNode)).toBe(false);
	});


	it('contains a working isEffect function', function() {
		var isEffect = Pizzicato.Util.isEffect;
		var delay = new Pizzicato.Effects.Delay();
		var sound = new Pizzicato.Sound();

		expect(isEffect(delay)).toBe(true);
		expect(isEffect(true)).toBe(false);
		expect(isEffect(false)).toBe(false);
		expect(isEffect(sound)).toBe(false);
	});


	it('contains a working isSound function', function() {
		var isSound = Pizzicato.Util.isSound;
		var delay = new Pizzicato.Effects.Delay();
		var sound = new Pizzicato.Sound();

		expect(isSound(delay)).toBe(false);
		expect(isSound(true)).toBe(false);
		expect(isSound(false)).toBe(false);
		expect(isSound(sound)).toBe(true);
	});


	it('returns a normalized version of a number', function() {
		var normalize = Pizzicato.Util.normalize;

		expect(typeof normalize).toBe('function');
		expect(normalize(0.5, 0, 20)).toBe(10);
		expect(normalize(0.5, 0, 100)).toBe(50);
		expect(normalize(0.5, 3, 20)).toBeCloseTo(11.5);
		expect(normalize(0.5, 0, 0)).toBeCloseTo(0);
	});


	it('Returns correct dry level from a mix', function() {
		var getDryLevel = Pizzicato.Util.getDryLevel;

		expect(typeof getDryLevel).toBe('function');
		expect(getDryLevel('')).toBe(0);
		expect(getDryLevel(0.5)).toBeCloseTo(1);
		expect(getDryLevel(0.42)).toBeCloseTo(1);
		expect(getDryLevel(0.0)).toBeCloseTo(1);
		expect(getDryLevel(0.01)).toBeCloseTo(1);
		expect(getDryLevel(0.6)).toBeCloseTo(0.8);
		expect(getDryLevel(0.7)).toBeCloseTo(0.6);
		expect(getDryLevel(0.8)).toBeCloseTo(0.4);
		expect(getDryLevel(0.9)).toBeCloseTo(0.2);
		expect(getDryLevel(1)).toBeCloseTo(0);
	});


	it('Returns correct wet level from a mix', function() {
		var getWetLevel = Pizzicato.Util.getWetLevel;

		expect(typeof getWetLevel).toBe('function');
		expect(getWetLevel('')).toBe(0);
		expect(getWetLevel(0.5)).toBeCloseTo(1);
		expect(getWetLevel(0.4)).toBeCloseTo(0.8);
		expect(getWetLevel(0.0)).toBeCloseTo(0);
		expect(getWetLevel(0.1)).toBeCloseTo(0.2);
		expect(getWetLevel(0.6)).toBeCloseTo(1);
		expect(getWetLevel(0.7)).toBeCloseTo(1);
		expect(getWetLevel(1)).toBeCloseTo(1);
	});
});