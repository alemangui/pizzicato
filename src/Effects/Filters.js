/**
 * Frequencies below the cutoff frequency pass 
 * through; frequencies above it are attenuated.
 */
Pizzicato.Effects.LowPassFilter = function(options) {
	Filter.call(this, options, 'lowpass');
};

/**
 * Frequencies below the cutoff frequency are 
 * attenuated; frequencies above it pass through.
 */
Pizzicato.Effects.HighPassFilter = function(options) {
	Filter.call(this, options, 'highpass');
};

/**
 * Filters used by Pizzicato stem from the biquad filter node. This 
 * function acts as a common constructor. The only thing that changes 
 * between filters is the 'type' of the biquad filter node.
 */
function Filter(options, type) {
	this.options = {};
	options = options || this.options;

	var defaults = {
		frequency: 350,
		peak: 1
	};

	this.inputNode = this.filterNode = Pz.context.createBiquadFilter();
	this.filterNode.type = type;

	this.outputNode = Pizzicato.context.createGain();

	this.filterNode.connect(this.outputNode);

	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
}

var filterPrototype = Object.create(baseEffect, {
	
	/**
	 * The cutoff frequency of the filter.
	 * MIN: 10
	 * MAX: 22050 (half the sampling rate of the current context)
	 */
	frequency: {
		enumerable: true,
		
		get: function() {
			return this.filterNode.frequency.value;
		},
		set: function(value) {
			if (Pizzicato.Util.isInRange(value, 10, 22050))
				this.filterNode.frequency.value = value;
		}
	},

	/**
	 * Indicates how peaked the frequency is around 
	 * the cutoff. The greater the value is, the 
	 * greater is the peak.
	 * MIN: 0.0001
	 * MAX: 1000
	 */
	peak: {
		enumerable: true,
		
		get: function() {
			return this.filterNode.Q.value;
		},
		set: function(value) {
			if (Pizzicato.Util.isInRange(value, 0.0001, 1000))
				this.filterNode.Q.value = value;
		}
	}
});

Pizzicato.Effects.LowPassFilter.prototype = filterPrototype;
Pizzicato.Effects.HighPassFilter.prototype = filterPrototype;