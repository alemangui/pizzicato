Pizzicato.Effects.Flanger = function(options) {

	this.options = {};
	options = options || this.options;

	var defaults = {
		time: 0.01,
		speed: 0.7,
		depth: 0.0008,
		feedback: 0.6,
		mix: 0.5
	};

	this.inputNode = Pizzicato.context.createGain();
	this.outputNode = Pizzicato.context.createGain();
	this.inputFeedbackNode = Pizzicato.context.createGain();
	this.wetGainNode = Pizzicato.context.createGain();
	this.dryGainNode = Pizzicato.context.createGain();
	this.delayNode = Pizzicato.context.createDelay();
	this.oscillatorNode = Pizzicato.context.createOscillator();
	this.gainNode = Pizzicato.context.createGain();
	this.feedbackNode = Pizzicato.context.createGain();
	this.oscillatorNode.type = 'sine';

	this.inputNode.connect(this.inputFeedbackNode);
	this.inputNode.connect(this.dryGainNode);

	this.inputFeedbackNode.connect(this.delayNode);
	this.inputFeedbackNode.connect(this.wetGainNode);

	this.delayNode.connect(this.wetGainNode);
	this.delayNode.connect(this.feedbackNode);

	this.feedbackNode.connect(this.inputFeedbackNode);

	this.oscillatorNode.connect(this.gainNode);
	this.gainNode.connect(this.delayNode.delayTime);

	this.dryGainNode.connect(this.outputNode);
	this.wetGainNode.connect(this.outputNode);

	this.oscillatorNode.start(0);

	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
};

Pizzicato.Effects.Flanger.prototype = Object.create(null, {
	
	time: {
		get: function() {
			return this.options.time;
		},

		set: function(time) {
			if (!Pz.Util.isInRange(time, 0.001, 0.02))
				return;

			this.options.time = time;
			this.delayNode.delayTime.value = time;
		}
	},


	speed: {
		get: function() {
			return this.options.speed;
		},

		set: function(speed) {
			if (!Pz.Util.isInRange(speed, 0.5, 5))
			return;

			this.options.speed = speed;
			this.oscillatorNode.frequency.value = speed;
		}
	},


	depth: {
		get: function() {
			return this.options.depth;
		},

		set: function(depth) {
			if (!Pz.Util.isInRange(depth, 0.0005, 0.005))
				return;

			this.options.depth = depth;
			this.gainNode.gain.value = depth;
		}
	},


	feedback: {
		get: function() {
			return this.options.feedback;
		},

		set: function(feedback) {
			if (!Pz.Util.isInRange(feedback, 0, 0.8))
				return;

			this.options.feedback = feedback;
			this.feedbackNode.gain.value = feedback;
		}
	},


	mix: {
		get: function() {
			return this.options.mix;
		},

		set: function(mix) {
			if (!Pz.Util.isInRange(mix, 0, 1))
				return;

			this.options.mix = mix;
			this.dryGainNode.gain.value = Pizzicato.Util.getDryLevel(this.mix);
			this.wetGainNode.gain.value = Pizzicato.Util.getWetLevel(this.mix);
		}
	}

});