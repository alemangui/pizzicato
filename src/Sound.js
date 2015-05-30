Pizzicato.Sound = function(options, callback) {
	var self = this;
	var util = Pizzicato.Util;

	this.masterVolume = this.getMasterVolume();

	this.lastTimePlayed = 0;
	this.effects = [];
	this.playing = this.paused = false;
	this.loop = util.isObject(options) && options.loop;
	this.volume = util.isObject(options) && options.volume ? options.volume : 1;

	if (util.isString(options))
		(this.initializeWithUrl.bind(this))(options, callback);

	else if (util.isObject(options) && util.isString(options.source))
		(this.initializeWithUrl.bind(this))(options.source, callback);

	else if (util.isObject(options) && util.isObject(options.wave))
		(this.initializeWithWave.bind(this))(options.wave, callback);

	else if (util.isObject(options) && !!options.microphone)
		(this.initializeWithMicrophone.bind(this))(options, callback);

	else if (util.isFunction(options))
		(this.initializeWithFunction.bind(this))(options, callback);
};


Pizzicato.Sound.prototype = Object.create(Pizzicato.Events, {

	play: {
		value: function() {
			if (this.playing) return;
			
			this.sourceNode = this.getSourceNode();

			this.playing = true;
			this.paused = false;
			
			if (Pz.Util.isFunction(this.sourceNode.start)) {
				this.lastTimePlayed = Pizzicato.context.currentTime;
				this.sourceNode.start(0, this.startTime || 0);
			}

			this.trigger('play');
		}
	},


	stop: {
		value: function() {
			if (!this.paused && !this.playing) return;

			this.paused = false;
			this.playing = false;

			if (Pz.Util.isFunction(this.sourceNode.stop))
				this.sourceNode.stop(0);
			else
				this.sourceNode.disconnect();

			this.trigger('stop');
		}
	},


	pause: {
		value: function() {
			if (this.paused) return;

			this.paused = true;
			this.playing = false;
			
			if (Pz.Util.isFunction(this.sourceNode.stop))
				this.sourceNode.stop(0);
			else 
				this.sourceNode.disconnect();				

			this.trigger('pause');
		}
	},


	onEnded: {
		value: function() {
			this.playing = false;
			this.startTime = this.paused ? Pizzicato.context.currentTime - this.lastTimePlayed : 0;
			this.trigger('stop');
			this.trigger('end');
		}
	},


	addEffect: {
		value: function(effect) {
			this.effects.push(effect);
			this.connectEffects();
			if (!!this.sourceNode) {
				this.sourceNode.disconnect();
				this.sourceNode.connect(this.getInputNode());
			}
		}
	},


	removeEffect: {
		value: function(effect) {
			var index = this.effects.indexOf(effect);

			if (index === -1) return;

			this.effects.splice(index, 1);
			this.connectEffects();
		}
	},


	connectEffects: {
		value: function() {
			for (var i = 0; i < this.effects.length; i++) {
				
				var destinationNode = i < this.effects.length - 1 ? this.effects[i + 1].inputNode : this.masterVolume;

				this.effects[i].outputNode.disconnect();
				this.effects[i].outputNode.connect(destinationNode);
			}
		}	
	},


	volume: {
		get: function() {
			if (this.masterVolume)
				return this.masterVolume.gain.value;
		},

		set: function(volume) {
			if (Pz.Util.isInRange(volume, 0, 1) && this.masterVolume)
				this.masterVolume.gain.value = volume;
		}
	},


	// Non enumberable properties


	initializeWithWave: {
		enumberable: false,

		value: function (waveOptions, callback) {
			this.getRawSourceNode = function() {
				var node = Pizzicato.context.createOscillator();
				node.type = waveOptions.type || 'sine';
				node.frequency.value = waveOptions.frequency || 440;

				return node;
			};
			if (Pz.Util.isFunction(callback)) 
				callback();
		}
	},
	

	initializeWithUrl: {
		enumberable: false,

		value: function (url, callback) {
			var self = this;
			var request = new XMLHttpRequest();

			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			request.onload = function(progressEvent) {
				var response = progressEvent.target.response;
				Pizzicato.context.decodeAudioData(response, (function(buffer) {
					self.getRawSourceNode = function() {
						var node = Pizzicato.context.createBufferSource();
						node.loop = this.loop;
						node.buffer = buffer;
						return node;
					};
					if (Pz.Util.isFunction(callback)) 
						callback();
				}).bind(self));
			};
			request.send();
		}
	},


	initializeWithMicrophone: {
		enumberable: false,

		value: function(options, callback) {
			navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
			var self = this;

			if (!navigator.getUserMedia) return;

			navigator.getUserMedia({ audio: true }, (function(stream) {

				self.getRawSourceNode = function() {
					return Pizzicato.context.createMediaStreamSource(stream);
				};

				if (Pz.Util.isFunction(callback))
					callback();

			}).bind(self), function(error) {

				if (Pz.Util.isFunction(callback))
					callback(error);

			});
		}
	},


	initializeWithFunction: {
		enumberable: false,

		value: function(fn, callback) {
			this.getRawSourceNode = function() {
				var node = Pizzicato.context.createScriptProcessor(undefined, 1, 1);
				node.onaudioprocess = fn;

				return node;
			};
		}
	},


	getSourceNode: {
		enumberable: false,

		value: function() {
			var node = this.getRawSourceNode();

			node.onended = this.onEnded.bind(this);
			node.connect(this.getInputNode());

			return node;
		}
	},


	getMasterVolume: {
		enumberable: false,

		value: function() {
			if (this.masterVolume)
				return this.masterVolume;

			var masterVolume = Pizzicato.context.createGain();
			masterVolume.connect(Pizzicato.context.destination);
			return masterVolume;
		}
	},


	getInputNode: {
		enumberable: false,

		value: function() {
			if (this.effects.length > 0) 
				return this.effects[0].inputNode;

			return this.masterVolume;
		}
	}
});