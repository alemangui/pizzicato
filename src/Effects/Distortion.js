Pizzicato.Effects.Distortion = function(options) {

	this.options = {};
	options = options || this.options;

	var defaults = {
		gain: 0.5
	};

	this.waveShaperNode = Pizzicato.context.createWaveShaper();
	this.inputNode = this.outputNode = this.waveShaperNode;

	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
};

Pizzicato.Effects.Distortion.prototype = Object.create(baseEffect, {

	/**
	 * Gets and sets the gain (amount of distortion).
	 */
	gain: {
		enumerable: true,
		
		get: function() {
			return this.options.gain;
		},

		set: function(gain) {
			if (!Pz.Util.isInRange(gain, 0, 1))
				return;

			this.options.gain = gain;
			this.adjustGain();
		}
	},

	/**
	 * Sets the wave curve with the correct gain. Taken from
	 * http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion
	 */
	adjustGain: {
		writable: false,
		configurable: false,
		enumerable: false,
		value: function() {
			var gain = Pz.Util.isNumber(this.options.gain) ? parseInt(this.options.gain * 100, 10) : 50;
			var n_samples = 44100;
			var curve = new Float32Array(n_samples);
			var deg = Math.PI / 180;
			var x;

			for (var i = 0; i < n_samples; ++i ) {
				x = i * 2 / n_samples - 1;
				curve[i] = (3 + gain) * x * 20 * deg / (Math.PI + gain * Math.abs(x));
			}

			this.waveShaperNode.curve = curve;
		}
	}

});