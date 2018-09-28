/**
 * Adapted from https://github.com/web-audio-components/simple-reverb
 */

Pizzicato.Effects.Reverb = function(options) {
	var self = this;

	this.options = {};
	options = options || this.options;

	var defaults = {
		mix: 0.5,
		time: 0.01,
		decay: 0.01,
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

	(buildImpulse.bind(this))();
};

Pizzicato.Effects.Reverb.prototype = Object.create(baseEffect, {

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

	time: {
		enumerable: true,

		get: function () {
			return this.options.time;
		},

		set: function (time) {
			if (!Pz.Util.isInRange(time, 0.0001, 10))
				return;

			this.options.time = time;
			(buildImpulse.bind(this))();
		}
	},

	decay: {
		enumerable: true,

		get: function () {
			return this.options.decay;
		},

		set: function (decay) {
			if (!Pz.Util.isInRange(decay, 0.0001, 10))
				return;

			this.options.decay = decay;
			(buildImpulse.bind(this))();
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
			(buildImpulse.bind(this))();
		}
	}

});

function buildImpulse() {

	var length = Pz.context.sampleRate * this.time;
	var impulse = Pizzicato.context.createBuffer(2, length, Pz.context.sampleRate);
	var impulseL = impulse.getChannelData(0);
	var impulseR = impulse.getChannelData(1);
	var n, i;

	for (i = 0; i < length; i++) {
		n = this.reverse ? length - i : i;
		impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this.decay);
		impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this.decay);
	}

        // https://github.com/alemangui/pizzicato/issues/91
        // ConvolverNode can be associated with only one buffer.
        // Not sure what's the best way, but we are recreating ConvolverNode
        // when properties change to work it around.
        if (this.reverbNode.buffer) {
          this.inputNode.disconnect(this.reverbNode);
          this.reverbNode.disconnect(this.wetGainNode);

          this.reverbNode = Pizzicato.context.createConvolver();
          this.inputNode.connect(this.reverbNode);
          this.reverbNode.connect(this.wetGainNode);
        }

	this.reverbNode.buffer = impulse;
}
