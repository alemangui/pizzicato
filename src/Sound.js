Pizzicato.Sound = function(description, callback) {
	var self = this;
	var util = Pizzicato.Util;
	var descriptionError = getDescriptionError(description);
	var hasOptions = util.isObject(description) && util.isObject(description.options);

	if (descriptionError) {
		console.error(descriptionError);
		throw new Error('Error initializing Pizzicato Sound: ' + descriptionError);
	}

	this.masterVolume = this.getMasterVolume();
	this.lastTimePlayed = 0;
	this.effects = [];
	this.playing = this.paused = false;
	this.loop = hasOptions && description.options.loop;
	this.sustain = hasOptions && description.options.sustain;
	this.volume = hasOptions && util.isNumber(description.options.volume) ? description.options.volume : 1;

	if (!description)
		(initializeWithWave.bind(this))({}, callback);

	else if (util.isString(description))
		(initializeWithUrl.bind(this))(description, callback);

	else if (util.isFunction(description))
		(initializeWithFunction.bind(this))(description, callback);

	else if (description.source === 'file')
		(initializeWithUrl.bind(this))(description.options.path, callback);

	else if (description.source === 'wave')
		(initializeWithWave.bind(this))(description.options, callback);

	else if (description.source === 'input')
		(initializeWithInput.bind(this))(description, callback);

	else if (description.source === 'script')
		(initializeWithFunction.bind(this))(description.options, callback);

	
	function getDescriptionError (description) {
		var supportedSources = ['wave', 'file', 'input', 'script'];

		if (description && (!util.isFunction(description) && !util.isString(description) && !util.isObject(description)))
			return 'Description type not supported. Initialize a sound using an object, a function or a string.';

		if (util.isObject(description)) {
			
			if (!util.isString(description.source) || supportedSources.indexOf(description.source) === -1)
				return 'Specified source not supported. Sources can be wave, file, input or script';

			if (description.source === 'file' && (!description.options || !description.options.path))
				return 'A path is needed for sounds with a file source';

			if (description.source === 'script' && (!description.options || !description.options.audioFunction))
				return 'An audio function is needed for sounds with a script source';
		}
	}


	function initializeWithWave (waveOptions, callback) {
		waveOptions = waveOptions || {};
		this.getRawSourceNode = function() {
			var frequency = this.sourceNode ? this.sourceNode.frequency.value : waveOptions.frequency;
			var node = Pizzicato.context.createOscillator();
			node.type = waveOptions.type || 'sine';
			node.frequency.value = (frequency || 440);

			return node;
		};
		this.sourceNode = this.getRawSourceNode();

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


	function initializeWithInput(options, callback) {
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


	function initializeWithFunction(options, callback) {
		var audioFunction = util.isFunction(options) ? options : options.audioFunction;
		var bufferSize = util.isObject(options) && options.bufferSize ? options.bufferSize : null;

		if (!bufferSize) {
			try { // Webkit does not automatically chose the buffer size
				var test = Pizzicato.context.createScriptProcessor();
			} catch (e) {
				bufferSize = 2048;
			}
		}

		this.getRawSourceNode = function() {
			var node = Pizzicato.context.createScriptProcessor(bufferSize, 1, 1);
			node.onaudioprocess = audioFunction;
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


	frequency: {
		enumerable: true,

		get: function() {
			if (this.sourceNode && Pz.Util.isOscillator(this.sourceNode)) {
				return this.sourceNode.frequency.value;
			}

			return null;
		},

		set: function(frequency) {
			if (this.sourceNode && Pz.Util.isOscillator(this.sourceNode)) {
				this.sourceNode.frequency.value = frequency;
			}
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