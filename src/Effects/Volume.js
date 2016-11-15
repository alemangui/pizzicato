Pizzicato.Effects.Volume = function(options) {

	this.options = {};
	options = options || this.options;

	var defaults = {
		value: 1
	};

	this.inputNode = Pizzicato.context.createGain();
	this.outputNode = Pizzicato.context.createGain();

	this.inputNode.connect(this.outputNode);

	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}
};

Pizzicato.Effects.Volume.prototype = Object.create(baseEffect, {

	/**
	 * Gets and sets the volume.
	 */
	value: {
		enumerable: true,

		get: function() {
			return this.options.value;	
		},

		set: function(volume) {
			if (!Pz.Util.isInRange(volume, 0, 1))
				return;

			this.options.value = volume;
			this.inputNode.gain.value = volume;
		}
	}

});