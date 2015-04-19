Pizzicato.Effects.Compressor = function(options) {

	this.options = options || {};

	var defaults = {
		threshold: -24, 		
		knee: 30,
		attack: 0.003,
		release: 0.250,
		ratio: 12
	};

	this.compressorNode = Pizzicato.context.createDynamicsCompressor();
	this.outputGainNode = Pizzicato.context.createGain();
	
	this.compressorNode.connect(this.outputGainNode);

	for (var key in defaults)
		this[key] = typeof this.options[key] === 'undefined' ? defaults[key] : this.options[key];
};

Pizzicato.Effects.Compressor.prototype = Object.create(null, {

	/**
	 * Applies the compression effect to a node and 
	 * returns the master gain node.
	 * @type {Function}
	 */
	applyToNode: {

		writable: false,

		configurable: false,

		enumerable: true,

		value: function(node) {
			node.connect(this.compressorNode);
			return this.outputGainNode;
		}
	},

	/**
	 * The level above which compression is applied to the audio.
	 * MIN: -100
	 * MAX: 0
	 */
	threshold: {
		get: function() {
			return this.compressorNode.threshold.value;
		},
		set: function(value) {
			if (Pizzicato.Util.isNumber(value))
				this.compressorNode.threshold.value = value;
		}
	},

	/**
	 * A value representing the range above the threshold where 
	 * the curve smoothly transitions to the "ratio" portion. More info:
	 * http://www.homestudiocorner.com/what-is-knee-on-a-compressor/
	 * MIN 0
	 * MAX 40
	 */
	knee: {
		get: function() {
			return this.compressorNode.knee.value;
		},
		set: function(value) {
			if (Pizzicato.Util.isNumber(value))
				this.compressorNode.knee.value = value;
		}
	},

	/**
	 * How soon the compressor starts to compress the dynamics after 
	 * the threshold is exceeded. If volume changes are slow, you can 
	 * push this to a high value. Short attack times will result in a 
	 * fast response to sudden, loud sounds, but will make the changes 
	 * in volume much more obvious to listeners.
	 * MIN 0
	 * MAX 1
	 */
	attack: {
		get: function() {
			return this.compressorNode.attack.value;
		},
		set: function(value) {
			if (Pizzicato.Util.isNumber(value))
				this.compressorNode.attack.value = value;
		}
	},

	/**
	 * How soon the compressor starts to release the volume level 
	 * back to normal after the level drops below the threshold. 
	 * A long time value will tend to lose quiet sounds that come 
	 * after loud ones, but will avoid the volume being raised too 
	 * much during short quiet sections like pauses in speech.
	 * MIN 0
	 * MAX 1
	 */
	release: {
		get: function() {
			return this.compressorNode.release.value;
		},
		set: function(value) {
			if (Pizzicato.Util.isNumber(value))
				this.compressorNode.release.value = value;
		}
	},

	/**
	 * The amount of compression applied to the audio once it 
	 * passes the threshold level. The higher the Ratio the more 
	 * the loud parts of the audio will be compressed.
	 * MIN 1
	 * MAX 20
	 */
	ratio: {
		get: function() {
			return this.compressorNode.ratio.value;
		},
		set: function(value) {
			if (Pizzicato.Util.isNumber(value))
				this.compressorNode.ratio.value = value;
		}
	},

	getCurrentGainReduction: function() {
		return this.compressorNode.reduction;
	}

});