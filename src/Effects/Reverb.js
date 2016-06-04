Pizzicato.Effects.Reverb = function(options, callback) {
	
	var self = this;

	console.log('Pizzicato.Effects.Reverb: request options %o, callback %o, self %o', options, callback, self);

	this.options = {};
	options = options || this.options;

	var defaults = {
		mix: 0.5,
		impulse: ''
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

	loadImpulseFile(options.impulse, self);
};

function loadImpulseFile(impulsepath, scope) {
	console.log('Pizzicato.Effects.Reverb:loadImpulseFile impulsepath %o scope %o', impulsepath, scope);
	//var self = this;

	var request = new XMLHttpRequest();
	request.open('GET', impulsepath, true);
	request.responseType = 'arraybuffer';

	request.onload = function (e) {
		console.log('Pizzicato.Effects.Reverb:loadImpulseFile request onload %o', e);
		var audioData = e.target.response;

		Pizzicato.context.decodeAudioData(
			audioData, 
			// success
			(function(buffer) {


				console.log('Pizzicato.Effects.Reverb:decodeAudioData buffer', buffer, scope);
				scope.getRawSourceNode = function() {
					var node = Pizzicato.context.createBufferSource();
					node.buffer = buffer;

					return node;
				};

				scope.convolverNode.buffer = buffer;

				if (scope.callback && Pz.Util.isFunction(scope.callback)) 
					scope.callback();

			}).bind(scope), 

			// error
			(function(error) {

				console.error('Pizzicato.Effects.Reverb:decodeAudioData Error decoding impulse file ' + impulsepath);

				error = error || new Error('Error decoding impulse file ' + impulsepath);

				if (scope.callback && Pz.Util.isFunction(scope.callback))
					scope.callback(error);

			}).bind(scope)
		);
	};

	request.onreadystatechange = function(event) {

		if (request.readyState === 4 && request.status !== 200)
			console.error('Error while fetching ' + impulsepath + '. ' + request.statusText);
	};
	request.send();
}


Pizzicato.Effects.Reverb.prototype = Object.create(null, {

	impulse: {
		get: function() {
			return this.options.impulse;
		},

		set: function(path) {
			console.log('Pizzicato.Effects.Reverb: trying to set impulse path ', path);
			if (!Pz.Util.isString(path))
				return;

			this.options.impulse = path;

			loadImpulseFile(this.options.impulse, this);
		}
	},

	mix: {
		enumberable: true,
		
		get: function() {
			return this.options.mix;
		},

		set: function(mix) {
			console.log('Pizzicato.Effects.Reverb: trying to set reverb mix', mix);
			if (!Pz.Util.isInRange(mix, 0, 1))
				return;

			this.options.mix = mix;
			this.dryGainNode.gain.value = Pizzicato.Util.getDryLevel(this.mix);
			this.wetGainNode.gain.value = Pizzicato.Util.getWetLevel(this.mix);
		}
	}

});