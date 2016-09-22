Pizzicato.Effects.Tremolo = function(options) {

	this.options = {};
	options = options || this.options;

	var defaults = {
		speed: 4,
		mix: 0.8
	};

	// create nodes
	this.inputNode = Pizzicato.context.createGain();
	this.outputNode = Pizzicato.context.createGain();
	this.dryGainNode = Pizzicato.context.createGain();
	this.wetGainNode = Pizzicato.context.createGain();

	this.lfoGainNode = Pizzicato.context.createGain();
	this.oscillator = Pizzicato.context.createOscillator();

	// dry mix
	this.inputNode.connect(this.dryGainNode);
	this.dryGainNode.connect(this.outputNode);


	// connections
	// we connect the oscillator to the gain running between in and wet out
	this.oscillator.connect(this.lfoGainNode.gain);
	// kick off the oscillator
	this.oscillator.start(0);

	// wet mix
	this.inputNode.connect(this.lfoGainNode);
	this.lfoGainNode.connect(this.wetGainNode);
	this.wetGainNode.connect(this.outputNode);

	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
};

Pizzicato.Effects.Tremolo.prototype = Object.create(null, {

	/**
	 * Gets and sets the dry/wet mix.
	 */
	mix: {
		enumerable: true,

		get: function() {
			return this.options.mix	;	
		},

		set: function(mix) {
			if (!Pz.Util.isInRange(mix, 0, 1))
				return;

			this.options.mix = mix;
			this.dryGainNode.gain.value = Pizzicato.Util.getDryLevel(this.mix);
			this.wetGainNode.gain.value = Pizzicato.Util.getWetLevel(this.mix);
		}
	},

	/**
	 * Speed of the vibrato
	 */
	speed: {
		enumerable: true,

		get: function() {
			return this.options.speed;	
		},

		set: function(speed) {
			if (!Pz.Util.isInRange(speed, 0, 20))
				return;

			this.options.speed = speed;
			this.oscillator.frequency.value = speed;
		}
	}

});