Pizzicato.Effects.StereoPanner = function(options) {

	this.options = {};
	options = options || this.options;

	var defaults = {
		pan: 0
	};

	this.inputNode = Pizzicato.context.createGain();
	this.outputNode = Pizzicato.context.createGain();

	if (Pizzicato.context.createStereoPanner) {
		this.pannerNode = Pizzicato.context.createStereoPanner();
		this.inputNode.connect(this.pannerNode);
		this.pannerNode.connect(this.outputNode);

	} else if (Pizzicato.context.createPanner) {

		console.warn('Your browser does not support the StereoPannerNode. Will use PannerNode instead.');

		this.pannerNode = Pizzicato.context.createPanner();
		this.pannerNode.type = 'equalpower';
		this.inputNode.connect(this.pannerNode);
		this.pannerNode.connect(this.outputNode);

	} else {
		console.warn('Your browser does not support the Panner effect.');
		this.inputNode.connect(this.outputNode);
	}


	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
};

Pizzicato.Effects.StereoPanner.prototype = Object.create(baseEffect, {

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

			if (!this.pannerNode)
				return;

			var isStereoPannerNode = this.pannerNode.toString().indexOf('StereoPannerNode') > -1;

			if (isStereoPannerNode) {
				this.pannerNode.pan.value = pan;	
			} else {
				this.pannerNode.setPosition(pan, 0, 1 - Math.abs(pan));
			}
		}
	}

});