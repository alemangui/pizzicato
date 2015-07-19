Pizzicato.Effects.LowPassFilter = function(options) {

	this.options = {};
	options = options || this.options;

	var defaults = {
		frequency: 350,
		peak: 1
	};

	this.inputNode = this.filterNode = Pz.context.createBiquadFilter();
	this.filterNode.type = 'lowpass';

	this.outputNode = Pizzicato.context.createGain();

	this.filterNode.connect(this.outputNode);

	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
};

Pizzicato.Effects.LowPassFilter.prototype = Object.create(null, {
	
	/**
	 * The cutoff frequency of the lowpass filter.
	 * MIN: 10
	 * MAX: 22050 (half the sampling rate of the current context)
	 */
	frequency: {
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
		get: function() {
			return this.filterNode.Q.value;
		},
		set: function(value) {
			if (Pizzicato.Util.isInRange(value, 0.0001, 1000))
				this.filterNode.Q.value = value;
		}
	}
});