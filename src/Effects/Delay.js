Pizzicato.Effects.Delay = function(options) {

	this.options = options || {};

	var defaults = {
		repetitions: 5,
		time: 0.3,
		mix: 0.5
	};

	for (var key in defaults)
		this.options[key] = typeof this.options[key] === 'undefined' ? defaults[key] : this.options[key];

	this.inputGainNode = Pizzicato.context.createGain();
	this.dryGainNode = Pizzicato.context.createGain();
	this.wetGainNode = Pizzicato.context.createGain();
	this.outputGainNode = Pizzicato.context.createGain();

	this.adjustMix();

	this.inputGainNode.connect(this.dryGainNode);
	this.dryGainNode.connect(this.outputGainNode);
	this.wetGainNode.connect(this.outputGainNode);

	this.createDelayLoop();	
};

Pizzicato.Effects.Delay.prototype = Object.create(null, {

	/**
	 * Applies the delay effect to a node and 
	 * returns the master gain node;
	 * @type {Function}
	 */
	applyToNode: {

		writable: false,

		configurable: false,

		enumerable: true,

		value: function(node) {
			node.connect(this.inputGainNode);
			return this.outputGainNode;
		}
	},

	/**
	 * Gets and sets the dry/wet mix.
	 */
	mix: {
		get: function() {
			return this.options.mix	;	
		},

		set: function(mix) {
			if (!Pz.Util.isNumber(mix) || mix < 0 || mix > 1)
				return;

			this.options.mix = mix;
			this.adjustMix();
		}
	},

	/**
	 * Time between each delay loop
	 */
	time: {
		get: function() {
			return this.options.time;	
		},

		set: function(time) {
			if (!Pz.Util.isNumber(time))
				return;

			this.options.time = time;
			this.adjustTime();
		}
	},

	/**
	 * Number of delayed sounds
	 */
	repetitions: {
		get: function() {
			return this.options.repetitions	;	
		},

		set: function(repetitions) {
			if (!Pz.Util.isNumber(repetitions))
				return;

			this.options.repetitions = parseInt(repetitions, 10);
			this.createDelayLoop();
		}
	},

	/**
	 * Creates the loop with delay nodes. If a previous
	 * delay loop exists, it disconnects it an re-creates it.
	 */
	createDelayLoop: {
		writable: false,
		configurable: false,
		enumerable: true,
		value: function() {
			var i;

			if (this.delayLoop && this.delayLoop.length > 0) {
				for (i = 0; i < this.delayLoop.length; i++) {
					this.delayLoop[i].delay.disconnect();
					this.delayLoop[i].feedback.disconnect();
				}
			}

			this.delayLoop = [];

			for (i = 0; i < this.repetitions; i++) {
				
				var delay = Pizzicato.context.createDelay();
				var feedback = Pizzicato.context.createGain();
				var parentNode = (i === 0) ? this.inputGainNode : this.delayLoop[i - 1].delay;
				
				delay.delayTime.value = this.time;
				feedback.gain.value = 1 - (i * (1 / (this.repetitions)));

				delay.connect(feedback);
				feedback.connect(this.wetGainNode);
				parentNode.connect(delay);

				this.delayLoop.push({ delay: delay, feedback: feedback });
			}				
		}
	},

	/**
	 * Ensures the time of the delay nodes 
	 * in the delay loop is correct
	 */
	adjustTime: {
		writable: false,
		configurable: false,
		enumerable: true,
		value: function() {

			for (var i = 0; i < this.delayLoop.length; i++)
				this.delayLoop[i].delay.delayTime.value = this.time;
		}
	},

	/**
	 * Ensures the dry/wet mix is correct.
	 */
	adjustMix: {
		writable: false,
		configurable: false,
		enumerable: true,
		value: function() {
			this.dryGainNode.gain.value = Pizzicato.Util.getDryLevel(this.mix);
			this.wetGainNode.gain.value = Pizzicato.Util.getWetLevel(this.mix);
		}
	}

});