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
    
    // Pre-filter gain stage
    this.inputNode = Pz.context.createGain();
    // Post-filter master gain stage
    this.outputNode = Pz.context.createGain();
    
    this.lowFilterNode = Pz.context.createBiquadFilter();
    this.lowFilterNode.type = 'lowpass';
    this.inputNode.connect(this.lowFilterNode);
    this.lowGainNode = Pz.context.createGain();
    this.lowFilterNode.connect(this.lowGainNode);
    
    this.midFilterNode = Pz.context.createBiquadFilter();
    this.midFilterNode.type = 'bandpass';
    this.inputNode.connect(this.midFilterNode);
    this.midGainNode = Pz.context.createGain();
    this.midFilterNode.connect(this.midGainNode);
    
    this.highFilterNode = Pz.context.createBiquadFilter();
    this.highFilterNode.type = 'highpass';
    this.inputNode.connect(this.highFilterNode);
    this.highGainNode = Pz.context.createGain();
    this.highFilterNode.connect(this.highGainNode);
    
    this.lowGainNode.connect(this.outputNode);
    this.midGainNode.connect(this.outputNode);
    this.highGainNode.connect(this.outputNode);
    
    // Prime the options with good values so that the mid-band center frequency can be calculated as the chosen options are set
    this.options.cutoff_frequency_low = defaults.cutoff_frequency_low;
    this.options.cutoff_frequency_high = defaults.cutoff_frequency_high;

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
	    return this.options.cutoff_frequency_low;
	},
	set: function(value) {
	    if (Pizzicato.Util.isInRange(value, 10, 22050)) {
                this.options.cutoff_frequency_low = value;
		this.lowFilterNode.frequency.value = value;
                this.midFilterNode.frequency.value = 0.5 * (this.options.cutoff_frequency_low + this.options.cutoff_frequency_high);
            }
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
	    return this.options.cutoff_frequency_high;
	},
	set: function(value) {
	    if (Pizzicato.Util.isInRange(value, 10, 22050)) {
                this.options.cutoff_frequency_high = value;
		this.highFilterNode.frequency.value = value;
                this.midFilterNode.frequency.value = 0.5 * (this.options.cutoff_frequency_low + this.options.cutoff_frequency_high);
            }
	}
    },
    
    /**
     * The gain of the low frequency band
     * MIN: -40
     * MAX: 15
     */
    low_band_gain: {
	enumerable: true,
	
	get: function() {
	    return this.options.low_band_gain;
	},
	set: function(value) {
	    if (Pizzicato.Util.isInRange(value, -40, 15)){
                this.options.low_band_gain = value;
		this.lowGainNode.gain.value = Math.pow(10,value/20);
            }
	}
    },
    
    /**
     * The gain of the mid frequency band in dB
     * MIN: -40
     * MAX: 15
     */
    mid_band_gain: {
	enumerable: true,
	
	get: function() {
	    return this.options.mid_band_gain;
	},
	set: function(value) {
	    if (Pizzicato.Util.isInRange(value, -40, 15)) {
                this.options.mid_band_gain = value;
		this.midGainNode.gain.value = Math.pow(10,value/20);
            }
	}
    },
    
    /**
     * The gain of the high frequency band in dB
     * MIN: -40
     * MAX: 15
     */
    high_band_gain: {
	enumerable: true,
	
	get: function() {
	    return this.options.high_band_gain;
	},
	set: function(value) {
	    if (Pizzicato.Util.isInRange(value, -40, 15)) {
                this.options.high_band_gain = value;
		this.highGainNode.gain.value = Math.pow(10,value/20);
            }
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
