Pizzicato.Effects.Panner = function(options) {

	this.options = {};
	options = options || this.options;

	var defaults = {
		pan: 0
	};

	this.inputNode = Pizzicato.context.createGain();
	this.outputNode = Pizzicato.context.createGain();

	this.pannerNode = Pizzicato.context.createStereoPanner();

	this.inputNode.connect(this.pannerNode);
	this.pannerNode.connect(this.outputNode);

	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
};

Pizzicato.Effects.Panner.prototype = Object.create(null, {

	/**
	 * Pan position
	 */
	pan: {
		enumerable: true,

		get: function() {
			return this.options.pan;	
		},

		set: function(pan) {
			if (!Pz.Util.isInRange(pan, -1, 1))
				return;

			this.options.pan = pan;
			this.pannerNode.pan.value = pan;
		}
	}

});