Pizzicato.Effects.Convolver = function(options, callback) {

	this.options = {};
	options = options || this.options;

	var self = this;
	var request = new XMLHttpRequest();
	var defaults = {
		mix: 0.5
	};

	this.callback = callback;

	this.inputNode = Pizzicato.context.createGain();
	this.convolverNode = Pizzicato.context.createConvolver();
	this.outputNode = Pizzicato.context.createGain();

	this.wetGainNode = Pizzicato.context.createGain();
	this.dryGainNode = Pizzicato.context.createGain();

	this.inputNode.connect(this.convolverNode);

	this.convolverNode.connect(this.wetGainNode);
	this.inputNode.connect(this.dryGainNode);

	this.dryGainNode.connect(this.outputNode);
	this.wetGainNode.connect(this.outputNode);


	for (var key in defaults) {
		this[key] = options[key];
		this[key] = (this[key] === undefined || this[key] === null) ? defaults[key] : this[key];
	}

	if (!options.impulse) {
		console.error('No impulse file specified.');
		return;
	}

	request.open('GET', options.impulse, true);
	request.responseType = 'arraybuffer';
	request.onload = function (e) {
		var audioData = e.target.response;

		Pizzicato.context.decodeAudioData(audioData, function(buffer) {

			self.convolverNode.buffer = buffer;

			if (self.callback && Pz.Util.isFunction(self.callback))
				self.callback();

		}, function(error) {

			error = error || new Error('Error decoding impulse file');

			if (self.callback && Pz.Util.isFunction(self.callback))
				self.callback(error);
		});
	};

	request.onreadystatechange = function(event) {
		if (request.readyState === 4 && request.status !== 200) {
			console.error('Error while fetching ' + options.impulse + '. ' + request.statusText);
		}
	};

	request.send();
};

Pizzicato.Effects.Convolver.prototype = Object.create(baseEffect, {

	mix: {
		enumerable: true,

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