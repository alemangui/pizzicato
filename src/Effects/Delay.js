Pizzicato.Effects.Delay = function(options) {

	this.options = {};
	options = options || this.options;

	var defaults = {
		feedback: 0.5,
		time: 0.3,
		mix: 0.5
	};

	this.inputNode = Pizzicato.context.createGain();
	this.outputNode = Pizzicato.context.createGain();
	this.dryGainNode = Pizzicato.context.createGain();
	this.wetGainNode = Pizzicato.context.createGain();
	this.feedbackGainNode = Pizzicato.context.createGain();
	this.delayNode = Pizzicato.context.createDelay();

	// line in to dry mix
	this.inputNode.connect(this.dryGainNode);
	// dry line out
	this.dryGainNode.connect(this.outputNode);

	// feedback loop
	this.delayNode.connect(this.feedbackGainNode);
	this.feedbackGainNode.connect(this.delayNode);

	// line in to wet mix
	this.inputNode.connect(this.delayNode);
	// wet out
	this.delayNode.connect(this.wetGainNode);
	
	// wet line out
	this.wetGainNode.connect(this.outputNode);

	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
};

Pizzicato.Effects.Delay.prototype = Object.create(baseEffect, {

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
	 * Time between each delayed sound
	 */
	time: {
		enumerable: true,

		get: function() {
			return this.options.time;	
		},

		set: function(time) {
			if (!Pz.Util.isInRange(time, 0, 180))
				return;

			this.options.time = time;
			this.delayNode.delayTime.value = time;
		}
	},

	/**
	 * Strength of each of the echoed delayed sounds.
	 */
	feedback: {
		enumerable: true,

		get: function() {
			return this.options.feedback;	
		},

		set: function(feedback) {
			if (!Pz.Util.isInRange(feedback, 0, 1))
				return;

			this.options.feedback = parseFloat(feedback, 10);
			this.feedbackGainNode.gain.value = this.feedback;
		}
	}

});