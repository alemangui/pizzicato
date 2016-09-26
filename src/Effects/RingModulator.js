/**
 * See http://webaudio.prototyping.bbc.co.uk/ring-modulator/
 */
Pizzicato.Effects.RingModulator = function(options) {

	this.options = {};
	options = options || this.options;

	var defaults = {
		speed: 30,
		distortion: 1,
		mix: 0.5
	};

	this.inputNode = Pizzicato.context.createGain();
	this.outputNode = Pizzicato.context.createGain();
	this.dryGainNode = Pizzicato.context.createGain();
	this.wetGainNode = Pizzicato.context.createGain();


	/**
	 * `vIn` is the modulation oscillator input 
	 * `vc` is the audio input.
	 */
	this.vIn = Pizzicato.context.createOscillator();
	this.vIn.start(0);
	this.vInGain = Pizzicato.context.createGain();
	this.vInGain.gain.value = 0.5;
	this.vInInverter1 = Pizzicato.context.createGain();
	this.vInInverter1.gain.value = -1;
	this.vInInverter2 = Pizzicato.context.createGain();
	this.vInInverter2.gain.value = -1;
	this.vInDiode1 = new DiodeNode(Pizzicato.context);
	this.vInDiode2 = new DiodeNode(Pizzicato.context);
	this.vInInverter3 = Pizzicato.context.createGain();
	this.vInInverter3.gain.value = -1;
	this.vcInverter1 = Pizzicato.context.createGain();
	this.vcInverter1.gain.value = -1;
	this.vcDiode3 = new DiodeNode(Pizzicato.context);
	this.vcDiode4 = new DiodeNode(Pizzicato.context);

	this.outGain = Pizzicato.context.createGain();
	this.outGain.gain.value = 3;

	this.compressor = Pizzicato.context.createDynamicsCompressor();
	this.compressor.threshold.value = -24;
	this.compressor.ratio.value = 16;

	// dry mix
	this.inputNode.connect(this.dryGainNode);
	this.dryGainNode.connect(this.outputNode);

	// wet mix	
	this.inputNode.connect(this.vcInverter1);
	this.inputNode.connect(this.vcDiode4.node);
	this.vcInverter1.connect(this.vcDiode3.node);
	this.vIn.connect(this.vInGain);
	this.vInGain.connect(this.vInInverter1);
	this.vInGain.connect(this.vcInverter1);
	this.vInGain.connect(this.vcDiode4.node);
	this.vInInverter1.connect(this.vInInverter2);
	this.vInInverter1.connect(this.vInDiode2.node);
	this.vInInverter2.connect(this.vInDiode1.node);
	this.vInDiode1.connect(this.vInInverter3);
	this.vInDiode2.connect(this.vInInverter3);
	this.vInInverter3.connect(this.compressor);
	this.vcDiode3.connect(this.compressor);
	this.vcDiode4.connect(this.compressor);
	this.compressor.connect(this.outGain);
	this.outGain.connect(this.wetGainNode);

	// line out
	this.wetGainNode.connect(this.outputNode);

	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
};

var DiodeNode = function(context_) {
	this.context = context_;
	this.node = this.context.createWaveShaper();
	this.vb = 0.2;
	this.vl = 0.4;
	this.h = 1;
	this.setCurve();
};

DiodeNode.prototype.setDistortion = function (distortion) {
	this.h = distortion;
	return this.setCurve();
};

DiodeNode.prototype.setCurve = function () {
	var i, 
		samples, 
		v, 
		value, 
		wsCurve, 
		_i, 
		_ref, 
		retVal;

	samples = 1024;
	wsCurve = new Float32Array(samples);
	
	for (i = _i = 0, _ref = wsCurve.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
		v = (i - samples / 2) / (samples / 2);
		v = Math.abs(v);
		if (v <= this.vb) {
			value = 0;
		} else if ((this.vb < v) && (v <= this.vl)) {
			value = this.h * ((Math.pow(v - this.vb, 2)) / (2 * this.vl - 2 * this.vb));
		} else {
			value = this.h * v - this.h * this.vl + (this.h * ((Math.pow(this.vl - this.vb, 2)) / (2 * this.vl - 2 * this.vb)));
		}
		wsCurve[i] = value;
	}

	retVal = this.node.curve = wsCurve;
	return retVal;
};

DiodeNode.prototype.connect = function(destination) {
	return this.node.connect(destination);
};


Pizzicato.Effects.RingModulator.prototype = Object.create(baseEffect, {

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
	 * Speed on the input oscillator
	 */
	speed: {
		enumerable: true,

		get: function() {
			return this.options.speed;	
		},

		set: function(speed) {
			if (!Pz.Util.isInRange(speed, 0, 2000))
				return;

			this.options.speed = speed;
			this.vIn.frequency.value = speed;
		}
	},

	/**
	 * Level of distortion
	 */
	distortion: {
		enumerable: true,

		get: function() {
			return this.options.distortion;	
		},

		set: function(distortion) {
			if (!Pz.Util.isInRange(distortion, 0.2, 50))
				return;

			this.options.distortion = parseFloat(distortion, 10);

			var diodeNodes = [this.vInDiode1, this.vInDiode2, this.vcDiode3, this.vcDiode4];

			for (var i=0, l=diodeNodes.length; i<l; i++) {
				diodeNodes[i].setDistortion(distortion);
			}
		}
	}

});