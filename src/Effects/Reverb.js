/**
 * Adapted from https://github.com/web-audio-components/simple-reverb
 */

Pizzicato.Effects.Reverb = function(options) {
	var self = this;

	this.options = {};
	options = options || this.options;

	var defaults = {
		mix: 0.5,
		seconds: 0.5,
		decay: 0.5,
		reverse: false
	};


	this.inputNode = Pizzicato.context.createGain();

	this.reverbNode = Pizzicato.context.createConvolver();
	
	this.outputNode = Pizzicato.context.createGain();

	this.wetGainNode = Pizzicato.context.createGain();
	this.dryGainNode = Pizzicato.context.createGain();

	this.inputNode.connect(this.reverbNode);

	this.reverbNode.connect(this.wetGainNode);
	this.inputNode.connect(this.dryGainNode);

	this.dryGainNode.connect(this.outputNode);
	this.wetGainNode.connect(this.outputNode);

	
	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}

	buildImpulse(self);
};

function buildImpulse(scope) {

	var rate = Pizzicato.context.sampleRate, 
		length = rate * scope.options.seconds, 
		decay = scope.options.decay, 
		impulse = Pizzicato.context.createBuffer(2, length, rate), 
		impulseL = impulse.getChannelData(0), 
		impulseR = impulse.getChannelData(1), 
		n, i;

	for (i = 0; i < length; i++) {
		n = scope.reverse ? length - i : i;
		impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
		impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
	}

	scope.reverbNode.buffer = impulse;
}


Pizzicato.Effects.Reverb.prototype = Object.create(null, {

	mix: {
		enumerable: true,
		
		get: function() {
			return this.options.mix;
		},

		set: function (mix) {
			if (!Pz.Util.isInRange(mix, 0, 1))
				return;

			this.options.mix = mix;
			this.dryGainNode.gain.value = Pizzicato.Util.getDryLevel(this.mix);
			this.wetGainNode.gain.value = Pizzicato.Util.getWetLevel(this.mix);
		}
	},

	seconds: {
		enumerable: true,

		get: function () {
			return this.options.seconds;
		},

		set: function (seconds) {
			if (!Pz.Util.isNumber(seconds))
				return;

			this.options.seconds = seconds;
			buildImpulse(this);
		}
	},

	decay: {
		enumerable: true,

		get: function () {
			return this.options.decay;
		},

		set: function (decay) {
			if (!Pz.Util.isNumber(decay))
				return;

			this.options.decay = decay;
			buildImpulse(this);
		}

	},

	reverse: {
		enumerable: true,

		get: function () {
			return this.options.reverse;
		},

		set: function (reverse) {
			if (!Pz.Util.isBool(reverse))
				return;

			this.options.reverse = reverse;
			buildImpulse(this);
		}

	}

});