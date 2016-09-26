Pizzicato.Util = {

	isString: function(arg) {
		return toString.call(arg) === '[object String]';
	},

	isObject: function(arg) {
		return toString.call(arg) === '[object Object]';
	},

	isFunction: function(arg) {
		return toString.call(arg) === '[object Function]';
	},

	isNumber: function(arg) {
		return toString.call(arg) === '[object Number]' && arg === +arg;
	},

	isArray: function(arg) {
		return toString.call(arg) === '[object Array]';
	},

	isInRange: function(arg, min, max) {
		if (!Pz.Util.isNumber(arg) || !Pz.Util.isNumber(min) || !Pz.Util.isNumber(max))
			return false;

		return arg >= min && arg <= max;
	},

	isValidShape: function (shape) {
		var validShapes = ['sine', 'square', 'triangle', 'sawtooth'];

		if (!Pz.Util.isString(shape) || 
				validShapes.indexOf(shape.toLowerCase()) < 0 ) {
			return false;
		}

		return true;
	},

	isBool: function(arg) {
		if (typeof(arg) !== "boolean")
			return false;

		return true;
	},

	isOscillator: function(audioNode) {
		return (audioNode && audioNode.toString() === "[object OscillatorNode]");
	},

	isEffect: function(effect) {
		for (var key in Pizzicato.Effects)
			if (effect instanceof Pizzicato.Effects[key])
				return true;

		return false;
	},

	// Takes a number from 0 to 1 and normalizes it 
	// to fit within range floor to ceiling
	normalize: function(num, floor, ceil) {
		if (!Pz.Util.isNumber(num) || !Pz.Util.isNumber(floor) || !Pz.Util.isNumber(ceil))
			return;
		
		return ((ceil - floor) * num) / 1 + floor;
	},

	getDryLevel: function(mix) {
		if (!Pz.Util.isNumber(mix) || mix > 1 || mix < 0)
			return 0;

		if (mix <= 0.5)
			return 1;

		return 1 - ((mix - 0.5) * 2);
	},

	getWetLevel: function(mix) {
		if (!Pz.Util.isNumber(mix) || mix > 1 || mix < 0)
			return 0;

		if (mix >= 0.5)
			return 1;

		return 1 - ((0.5 - mix) * 2);
	}
};