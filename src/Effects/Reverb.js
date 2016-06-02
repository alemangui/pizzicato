Pizzicato.Effects.Reverb = function(options, callback) {
	console.log('... Reverb request options %o, callback %o', options, callback);
	var self = this;

	this.options = {};
	options = options || this.options;

	var defaults = {
		mix: 0.5
	};

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

	var request = new XMLHttpRequest();
	request.open('GET', options.impulse, true);
	request.responseType = 'arraybuffer';

	request.onload = function (e) {
		console.log('... Reverb request onload %o', e);
		var audioData = e.target.response;

		Pizzicato.context.decodeAudioData(
			audioData, 
			// success
			(function(buffer) {

				self.getRawSourceNode = function() {
					var node = Pizzicato.context.createBufferSource();
					node.buffer = buffer;

					return node;
				};

				self.convolverNode.buffer = buffer;

				if (callback && Pz.Util.isFunction(callback)) 
					callback();

			}).bind(self), 

			// error
			(function(error) {

				console.error('Error decoding impulse file ' + options.impulse);

				error = error || new Error('Error decoding impulse file ' + options.impulse);

				if (callback && Pz.Util.isFunction(callback))
					callback(error);

			}).bind(self)
		);
	};

	request.onreadystatechange = function(event) {

		if (request.readyState === 4 && request.status !== 200)
			console.error('Error while fetching ' + options.impulse + '. ' + request.statusText);
	};
	request.send();
};



Pizzicato.Effects.Reverb.prototype = Object.create(null, {

	mix: {
		enumberable: true,
		
		get: function() {
			return this.options.mix;
		},

		set: function(mix) {
			console.log('trying to set reverb mix', mix);
			if (!Pz.Util.isInRange(mix, 0, 1))
				return;

			this.options.mix = mix;
			this.dryGainNode.gain.value = Pizzicato.Util.getDryLevel(this.mix);
			this.wetGainNode.gain.value = Pizzicato.Util.getWetLevel(this.mix);
		}
	}

});