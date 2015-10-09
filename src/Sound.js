Pizzicato.Sound = function(options, callback) {
	var self = this;
	var util = Pizzicato.Util;

	this.masterVolume = this.getMasterVolume();
	this.lastTimePlayed = 0;
	this.effects = [];
	this.playing = this.paused = false;
	this.loop = util.isObject(options) && options.loop;
	this.volume = util.isObject(options) && options.volume ? options.volume : 1;
	this.sustain = options && options.sustain;

	if (util.isString(options))
		(initializeWithUrl.bind(this))(options, callback);

	else if (util.isObject(options) && util.isString(options.source))
		(initializeWithUrl.bind(this))(options.source, callback);

	else if (util.isObject(options) && util.isObject(options.wave))
		(initializeWithWave.bind(this))(options.wave, callback);

	else if (util.isObject(options) && !!options.microphone)
		(initializeWithMicrophone.bind(this))(options, callback);

	else if (util.isFunction(options))
		(initializeWithFunction.bind(this))(options, callback);

	function initializeWithWave (waveOptions, callback) {
		this.getRawSourceNode = function() {
			var node = Pizzicato.context.createOscillator();
			node.type = waveOptions.type || 'sine';
			node.frequency.value = waveOptions.frequency || 440;

			return node;
		};
		if (util.isFunction(callback)) 
			callback();
	}

	function initializeWithUrl (url, callback) {
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
				if (util.isFunction(callback)) 
					callback();
			}).bind(self));
		};
		request.onreadystatechange = function(event) {
			if (request.readyState === 4 && request.status !== 200)
				console.error('Error while fetching ' + url + '. ' + request.statusText);
		};
		request.send();
	}

	function initializeWithMicrophone(options, callback) {
		navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

		if (!navigator.getUserMedia) return;

		navigator.getUserMedia({ audio: true }, (function(stream) {
			self.getRawSourceNode = function() {
				return Pizzicato.context.createMediaStreamSource(stream);
			};
			if (util.isFunction(callback))
				callback();

		}).bind(self), function(error) {
			if (util.isFunction(callback))
				callback(error);
		});
	}

	function initializeWithFunction(fn, callback) {
		this.getRawSourceNode = function() {
			var node = Pizzicato.context.createScriptProcessor(2048, 1, 1);
			node.onaudioprocess = fn;
			return node;
		};
	}
};


Pizzicato.Sound.prototype = Object.create(Pizzicato.Events, {

	play: {
		enumerable: true,
		
		value: function() {
			if (this.playing) 
				return;
			
			if (this.sustainActive && this.onSustainDone)
				this.onSustainDone();

			this.playing = true;
			this.paused = false;

			this.sourceNode = this.getSourceNode();

			if (Pz.Util.isFunction(this.sourceNode.start)) {
				this.lastTimePlayed = Pizzicato.context.currentTime;
				this.sourceNode.start(0, this.startTime || 0);
			}

			this.trigger('play');

		}
	},


	stop: {
		enumerable: true,
		
		value: function() {
			if (!this.paused && !this.playing) return;

			var self = this;
			this.paused = this.playing = false;

			var stopSound = function() {
				return Pz.Util.isFunction(self.sourceNode.stop) ? self.sourceNode.stop(0) : self.sourceNode.disconnect();
			};

			if (Pz.Util.isNumber(this.sustain))
				this.prepareSustain(stopSound);
			else 
				stopSound();
				
			this.startTime = 0;
			self.trigger('stop');
		}
	},


	pause: {
		enumerable: true,
		
		value: function() {
			if (this.paused || !this.playing) return;

			this.paused = true;
			this.playing = false;
			
			if (Pz.Util.isFunction(this.sourceNode.stop))
				this.sourceNode.stop(0);
			else 
				this.sourceNode.disconnect();				

			this.startTime = Pz.context.currentTime - this.lastTimePlayed;
			this.trigger('pause');
		}
	},


	onEnded: {
		enumerable: true,
		
		value: function() {
			if (!this.paused)
				this.trigger('end');
		}
	},


	addEffect: {
		enumerable: true,
		
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
		enumerable: true,
		
		value: function(effect) {
			var index = this.effects.indexOf(effect);

			if (index === -1) return;

			this.effects.splice(index, 1);
			this.connectEffects();
		}
	},


	connectEffects: {
		enumerable: true,
		
		value: function() {
			for (var i = 0; i < this.effects.length; i++) {
				
				var destinationNode = i < this.effects.length - 1 ? this.effects[i + 1].inputNode : this.masterVolume;

				this.effects[i].outputNode.disconnect();
				this.effects[i].outputNode.connect(destinationNode);
			}
		}	
	},


	volume: {
		enumerable: true,
		
		get: function() {
			if (this.masterVolume)
				return this.masterVolume.gain.value;
		},

		set: function(volume) {
			if (Pz.Util.isInRange(volume, 0, 1) && this.masterVolume)
				this.masterVolume.gain.value = volume;
		}
	},


	/**
	 * Returns the node that produces the sound. For example, an oscillator
	 * if the Sound object was initialized with a wave option.
	 */
	getSourceNode: {
		enumerable: true,

		value: function() {
			var node = this.getRawSourceNode();

			node.onended = this.onEnded.bind(this);
			node.connect(this.getInputNode());

			return node;
		}
	},


	/**
	 * Returns the first node in the graph. When there are effects,
	 * the first node is the input node of the first effect.
	 */
	getInputNode: {
		enumerable: true,

		value: function() {
			if (this.effects.length > 0) 
				return this.effects[0].inputNode;

			return this.masterVolume;
		}
	},


	/**
	 * Returns the node used for the master volume. This node is connected
	 * to a sustainNode that manages the sustain volume changes without 
	 * modifying the masterVolume. The sustainNode is the one connected
	 * to the destination.
	 */
	getMasterVolume: {
		enumerable: true,

		value: function() {
			if (this.masterVolume)
				return this.masterVolume;

			var masterVolume = Pizzicato.context.createGain();
			this.sustainNode = Pizzicato.context.createGain();

			masterVolume.connect(this.sustainNode);
			this.sustainNode.connect(Pizzicato.context.destination);

			return masterVolume;
		}
	},


	/**
	 * To achieve the sustain effect, we use web API function linearRampToValueAtTime.
	 * In order for it to work we must set first the initial value with setValueAtTime.
	 * Since there is no callback for linearRampToValueAtTime, a setTimeout with the 
	 * time of the sustain is necessary.
	 */
	prepareSustain: {
		enumerable: true,

		value: function(stopSound) {
			var self = this;

			this.sustainNode.gain.setValueAtTime(1, Pz.context.currentTime);
			this.sustainNode.gain.linearRampToValueAtTime(0.001, Pz.context.currentTime + this.sustain);
			this.sustainActive = true;

			this.onSustainDone = function() {
				if (self.sustainTimeout) 
					clearTimeout(self.sustainTimeout);

				self.sustainNode.gain.cancelScheduledValues(Pz.context.currentTime);
				self.sustainNode.gain.setValueAtTime(1, Pz.context.currentTime + 0.001);
			
				self.sustainActive = false;
				stopSound();	
			};

			this.sustainTimeout = setTimeout(this.onSustainDone, self.sustain * 1000);
		}
	}
});