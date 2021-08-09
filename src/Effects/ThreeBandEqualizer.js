/**
 * A Three-band equalizer with gain adjustments for low, mid, and high frequencies
 */
Pizzicato.Effects.ThreeBandEqualizer = function(options) {
    Equalizer.call(this, options);
};

/**
 * Filters used by Pizzicato stem from the biquad filter node. This 
 * function acts as a common constructor. The only thing that changes 
 * between filters is the 'type' of the biquad filter node.
 */
function Equalizer(options) {
    this.options = {};
    options = options || this.options;

    var defaults = {
        cutoff_frequency_low: 400,
        cutoff_frequency_high: 4000,
        low_band_gain: 1,
        mid_band_gain: 1,
        high_band_gain: 1,
        peak: 1
    };
    
    this.inputNode = Pz.context.createGain();
    this.outputNode = Pz.context.createGain();

    this.lowFilterNode = Pz.context.createBiquadFilter();
    this.lowFilterNode.type = 'lowpass';
    this.lowFilterNode.frequency = cutoff_frequency_low;
    this.lowFilterNode.gain = low_band_gain;
    this.inputNode.connect(this.lowFilterNode);

    this.midFilterNode = Pz.context.createBiquadFilter();
    this.midFilterNode.type = 'bandpass';
    this.midFilterNode.frequency = 0.5 * (cutoff_frequency_low + cutoff_frequency_high);
    this.midFilterNode.gain = mid_band_gain;


    this.highFilterNode = Pz.context.createBiquadFilter();
    this.highFilterNode.type = 'highpass';
    this.highFilterNode.frequency = cutoff_frequency_high;
    this.highFilterNode.gain = high_band_gain;
    this.inputNode.connect(this.highFilterNode);

    this.lowFilterNode.connect(this.outputNode);
    this.highFilterNode.connect(this.outputNode);

    for (var key in defaults) {
	this[key] = options[key];
	this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
    }
}

var equalizerPrototype = Object.create(baseEffect, {
    
    /**
     * The cutoff frequency of the low band.
     * MIN: 10
     * MAX: 22050 (half the sampling rate of the current context)
     */
    cutoff_frequency_low: {
	enumerable: true,
	
	get: function() {
	    return this.lowFilterNode.frequency.value;
	},
	set: function(value) {
	    if (Pizzicato.Util.isInRange(value, 10, 22050))
		this.lowFilterNode.frequency.value = value;
	}
    },

    /**
     * The cutoff frequency of the high band.
     * MIN: 10
     * MAX: 22050 (half the sampling rate of the current context)
     */
    cutoff_frequency_high: {
	enumerable: true,
	
	get: function() {
	    return this.highFilterNode.frequency.value;
	},
	set: function(value) {
	    if (Pizzicato.Util.isInRange(value, 10, 22050))
		this.highFilterNode.frequency.value = value;
	}
    },

    /**
     * The gain of the low frequency band
     * MIN: 0.0
     * MAX: 2
     */
    low_band_gain: {
	enumerable: true,
	
	get: function() {
	    return this.lowFilterNode.gain.value;
	},
	set: function(value) {
	    if (Pizzicato.Util.isInRange(value, 0.0, 2))
		this.lowFilterNode.gain.value = value;
	}
    },

    /**
     * The gain of the mid frequency band
     * MIN: 0.0
     * MAX: 2
     */
    mid_band_gain: {
	enumerable: true,
	
	get: function() {
	    return this.midFilterNode.gain.value;
	},
	set: function(value) {
	    if (Pizzicato.Util.isInRange(value, 0.0, 2))
		this.midFilterNode.gain.value = value;
	}
    },

    /**
     * The gain of the high frequency band
     * MIN: 0.0
     * MAX: 2
     */
    high_band_gain: {
	enumerable: true,
	
	get: function() {
	    return this.highFilterNode.gain.value;
	},
	set: function(value) {
	    if (Pizzicato.Util.isInRange(value, 0.0, 2))
		this.highFilterNode.gain.value = value;
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
	    return this.lowFilterNode.Q.value;
	},
	set: function(value) {
	    if (Pizzicato.Util.isInRange(value, 0.0001, 1000))
		this.lowFilterNode.Q.value = value;
		this.midFilterNode.Q.value = value;
		this.highFilterNode.Q.value = value;
	}
    }
});

Pizzicato.Effects.ThreeBandEqualizer.prototype = equalizerPrototype;
