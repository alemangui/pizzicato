Pizzicato.Effects.Quadrafuzz = function(options) {

	this.options = {};
	options = options || this.options;

	var defaults = {
		lowGain: 0.6,
		midLowGain: 0.8,
		midHighGain: 0.5,
		highGain: 0.6
	};


	this.inputNode = Pz.context.createGain();
	this.outputNode = Pz.context.createGain();
	this.dryGainNode = Pz.context.createGain();
	this.wetGainNode = Pz.context.createGain();


	this.lowpassLeft = Pz.context.createBiquadFilter();
	this.lowpassLeft.type = 'lowpass';
	this.lowpassLeft.frequency.value = 147;
	this.lowpassLeft.Q.value = 0.7071;

	this.bandpass1Left = Pz.context.createBiquadFilter();
	this.bandpass1Left.type = 'bandpass';
	this.bandpass1Left.frequency.value = 587;
	this.bandpass1Left.Q.value = 0.7071;

	this.bandpass2Left = Pz.context.createBiquadFilter();
	this.bandpass2Left.type = 'bandpass';
	this.bandpass2Left.frequency.value = 2490;
	this.bandpass2Left.Q.value = 0.7071;

	this.highpassLeft = Pz.context.createBiquadFilter();
	this.highpassLeft.type = 'highpass';
	this.highpassLeft.frequency.value = 4980;
	this.highpassLeft.Q.value = 0.7071;


	this.overdrives = [];
	for (var i = 0; i < 4; i++) {
		this.overdrives[i] = Pz.context.createWaveShaper();
		this.overdrives[i].curve = getDistortionCurve();
	}


	this.inputNode.connect(this.wetGainNode);
	this.inputNode.connect(this.dryGainNode);
	this.dryGainNode.connect(this.outputNode);

	var filters = [this.lowpassLeft, this.bandpass1Left, this.bandpass2Left, this.highpassLeft];
	for (i = 0; i < filters.length; i++) {
		this.wetGainNode.connect(filters[i]);
		filters[i].connect(this.overdrives[i]);
		this.overdrives[i].connect(this.outputNode);
	}

	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
};

function getDistortionCurve(gain) {
	var sampleRate = Pz.context.sampleRate;
	var curve = new Float32Array(sampleRate);
	var deg = Math.PI / 180;

	for (var i = 0; i < sampleRate; i++) {
		var x = i * 2 / sampleRate - 1;
		curve[i] = (3 + gain) * x * 20 * deg / (Math.PI + gain * Math.abs(x));
	}
	return curve;
}

Pizzicato.Effects.Quadrafuzz.prototype = Object.create(baseEffect, {

	lowGain: {
		enumerable: true,

		get: function() {
			return this.options.lowGain;
		},

		set: function(lowGain) {
			if (!Pz.Util.isInRange(lowGain, 0, 1))
				return;

			this.options.lowGain = lowGain;
			this.overdrives[0].curve = getDistortionCurve(Pz.Util.normalize(this.lowGain, 0, 150));
		}
	},

	midLowGain: {
		enumerable: true,

		get: function() {
			return this.options.midLowGain;
		},

		set: function(midLowGain) {
			if (!Pz.Util.isInRange(midLowGain, 0, 1))
				return;

			this.options.midLowGain = midLowGain;
			this.overdrives[1].curve = getDistortionCurve(Pz.Util.normalize(this.midLowGain, 0, 150));
		}
	},

	midHighGain: {
		enumerable: true,

		get: function() {
			return this.options.midHighGain;
		},

		set: function(midHighGain) {
			if (!Pz.Util.isInRange(midHighGain, 0, 1))
				return;

			this.options.midHighGain = midHighGain;
			this.overdrives[2].curve = getDistortionCurve(Pz.Util.normalize(this.midHighGain, 0, 150));
		}
	},

	highGain: {
		enumerable: true,

		get: function() {
			return this.options.highGain;
		},

		set: function(highGain) {
			if (!Pz.Util.isInRange(highGain, 0, 1))
				return;

			this.options.highGain = highGain;
			this.overdrives[3].curve = getDistortionCurve(Pz.Util.normalize(this.highGain, 0, 150));
		}
	}
});

