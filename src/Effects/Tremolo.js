Pizzicato.Effects.Tremolo = function(options) {

	// adapted from
	// https://github.com/mmckegg/web-audio-school/blob/master/lessons/3.%20Effects/13.%20Tremolo/answer.js

	this.options = {};
	options = options || this.options;

	var defaults = {
		speed: 4,
		depth: 1,
		mix: 0.8
	};

	// create nodes
	this.inputNode = Pizzicato.context.createGain();
	this.outputNode = Pizzicato.context.createGain();
	this.dryGainNode = Pizzicato.context.createGain();
	this.wetGainNode = Pizzicato.context.createGain();

	this.tremoloGainNode = Pizzicato.context.createGain();
	this.tremoloGainNode.gain.value = 0;
	this.lfoNode = Pizzicato.context.createOscillator();

	this.shaperNode = Pizzicato.context.createWaveShaper();
	this.shaperNode.curve = new Float32Array([0, 1]);
	this.shaperNode.connect(this.tremoloGainNode.gain);

	// dry mix
	this.inputNode.connect(this.dryGainNode);
	this.dryGainNode.connect(this.outputNode);
	
	// wet mix
	this.lfoNode.connect(this.shaperNode);
	this.lfoNode.type = 'sine';
	this.lfoNode.start(0);

	this.inputNode.connect(this.tremoloGainNode);
	this.tremoloGainNode.connect(this.wetGainNode);
	this.wetGainNode.connect(this.outputNode);

	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
};

Pizzicato.Effects.Tremolo.prototype = Object.create(baseEffect, {

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
	 * Speed of the tremolo
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
			this.lfoNode.frequency.value = speed;
		}
	},

	/**
	 * Depth of the tremolo
	 */
	depth: {
		enumerable: true,

		get: function() {
			return this.options.depth;	
		},

		set: function(depth) {
			if (!Pz.Util.isInRange(depth, 0, 1)) 
				return;
			
			this.options.depth = depth;
			this.shaperNode.curve = new Float32Array([1-depth, 1]);
		}
	}

});