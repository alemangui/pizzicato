/**
 * Adapted from https://github.com/mmckegg/web-audio-school/blob/master/lessons/3.%20Effects/18.%20Ping%20Pong%20Delay/answer.js
 */

Pizzicato.Effects.PingPongDelay = function(options) {

	this.options = {};
	options = options || this.options;

	var defaults = {
		feedback: 0.5,
		time: 0.3,
		mix: 0.5
	};

	this.inputNode = Pizzicato.context.createGain();
	this.outputNode = Pizzicato.context.createGain();
	this.delayNodeLeft = Pizzicato.context.createDelay();
	this.delayNodeRight = Pizzicato.context.createDelay();
	this.dryGainNode = Pizzicato.context.createGain();
	this.wetGainNode = Pizzicato.context.createGain();
	this.feedbackGainNode = Pizzicato.context.createGain();
	this.channelMerger = Pizzicato.context.createChannelMerger(2);

	// dry mix
	this.inputNode.connect(this.dryGainNode);
	// dry mix out
	this.dryGainNode.connect(this.outputNode);

	// the feedback loop
	this.delayNodeLeft.connect(this.channelMerger, 0, 0);
	this.delayNodeRight.connect(this.channelMerger, 0, 1);
	this.delayNodeLeft.connect(this.delayNodeRight);
	this.feedbackGainNode.connect(this.delayNodeLeft);
	this.delayNodeRight.connect(this.feedbackGainNode);

	// wet mix
	this.inputNode.connect(this.feedbackGainNode);

	// wet out
	this.channelMerger.connect(this.wetGainNode);
	this.wetGainNode.connect(this.outputNode);

	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
};

Pizzicato.Effects.PingPongDelay.prototype = Object.create(baseEffect, {

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
			this.delayNodeLeft.delayTime.value = time;
			this.delayNodeRight.delayTime.value = time;
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