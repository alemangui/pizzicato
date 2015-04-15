Pizzicato.Effects.Compressor = function(options) {

	this.options = options || {};

	var defaults = {
		threshold: -24,
		knee: 30,
		attack: 0.003,
		release: 0.250
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


	threshold: {
		get: function() {
			return this.compressorNode.threshold.value;
		},
		set: function(value) {
			if (Pizzicato.Util.isNumber(value))
				this.compressorNode.threshold.value = value;
		}
	},

	knee: {
		get: function() {
			return this.compressorNode.knee.value;
		},
		set: function(value) {
			if (Pizzicato.Util.isNumber(value))
				this.compressorNode.knee.value = value;
		}
	},

	attack: {
		get: function() {
			return this.compressorNode.attack.value;
		},
		set: function(value) {
			if (Pizzicato.Util.isNumber(value))
				this.compressorNode.attack.value = value;
		}
	},

	release: {
		get: function() {
			return this.compressorNode.release.value;
		},
		set: function(value) {
			if (Pizzicato.Util.isNumber(value))
				this.compressorNode.release.value = value;
		}
	},

	getCurrentGainReduction: function() {
		return this.compressorNode.reduction;
	}

});