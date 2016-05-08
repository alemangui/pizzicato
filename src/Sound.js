Pizzicato.Sound = function(description, callback) {
	var self = this;
	var util = Pizzicato.Util;
	var descriptionError = getDescriptionError(description);
	var hasOptions = util.isObject(description) && util.isObject(description.options);
	var defaultAttack = 0.04;
	var defaultSustain = 0.04;

	if (descriptionError) {
		console.error(descriptionError);
		throw new Error('Error initializing Pizzicato Sound: ' + descriptionError);
	}

	this.masterVolume = Pizzicato.context.createGain();
	this.masterVolume.connect(Pizzicato.masterGainNode);

	this.fadeNode = Pizzicato.context.createGain();

	this.lastTimePlayed = 0;
	this.effects = [];
	this.playing = this.paused = false;
	this.loop = hasOptions && description.options.loop;
	this.attack = hasOptions && util.isNumber(description.options.attack) ? description.options.attack : defaultAttack;
	this.sustain = hasOptions && util.isNumber(description.options.sustain) ? description.options.sustain : defaultSustain;
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


	function initializeWithUrl (paths, callback) {
		paths = util.isArray(paths) ? paths : [paths];

		var request = new XMLHttpRequest();
		request.open('GET', paths[0], true);
		request.responseType = 'arraybuffer';

		request.onload = function(progressEvent) {

			Pizzicato.context.decodeAudioData(progressEvent.target.response, (function(buffer) {

				self.getRawSourceNode = function() {
					var node = Pizzicato.context.createBufferSource();
					node.loop = this.loop;
					node.buffer = buffer;
					return node;
				};
				if (util.isFunction(callback)) 
					callback();

			}).bind(self), (function(error) {

				console.error('Error decoding audio file ' + paths[0]);

				if (paths.length > 1) {
					paths.shift();
					initializeWithUrl(paths, callback);
					return;
				}

				error = error || new Error('Error decoding audio file ' + paths[0]);

				if (util.isFunction(callback))
					callback(error);

			}).bind(self));

		};
		request.onreadystatechange = function(event) {

			if (request.readyState === 4 && request.status !== 200)
				console.error('Error while fetching ' + paths[0] + '. ' + request.statusText);
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

			this.playing = true;
			this.paused = false;
			this.sourceNode = this.getSourceNode();
			this.applyAttack();

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
			if (!this.paused && !this.playing) 
				return;

			this.paused = this.playing = false;
			this.stopWithSustain();
				
			this.startTime = 0;
			this.trigger('stop');
		}
	},


	pause: {
		enumerable: true,
		
		value: function() {
			if (this.paused || !this.playing) 
				return;

			this.paused = true;
			this.playing = false;

			this.stopWithSustain();	

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
				this.fadeNode.disconnect();
				this.fadeNode.connect(this.getInputNode());
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
				
				var isLastEffect = i === this.effects.length - 1;
				var destinationNode = isLastEffect ? this.masterVolume : this.effects[i + 1].inputNode;

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
			if (!!this.sourceNode)
				this.sourceNode.disconnect();

			var sourceNode = this.getRawSourceNode();

			sourceNode.connect(this.fadeNode);
			sourceNode.onended = this.onEnded.bind(this);
			this.fadeNode.connect(this.getInputNode());

			return sourceNode;
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
	 * Returns an analyser node located right after the master volume.
	 * This node is created lazily.
	 */
	getAnalyser: {
		enumerable: true,

		value: function() {

			if (this.analyser)
				return this.analyser;
	
			this.analyser = Pizzicato.context.createAnalyser();
			this.masterVolume.disconnect();
			this.masterVolume.connect(this.analyser);
			this.analyser.connect(Pizzicato.masterGainNode);
			return this.analyser;
		}
	},

	/**
	 * Will take the current source node and work up the volume
	 * gradually in as much time as specified in the attack property
	 * of the sound.
	 */
	applyAttack: {
		enumerable: false,

		value: function() {
			if (!this.attack)
				return;

			this.fadeNode.gain.setValueAtTime(0.00001, Pizzicato.context.currentTime);
			this.fadeNode.gain.linearRampToValueAtTime(1, Pizzicato.context.currentTime + this.attack);
		}
	},

	/**
	 * Will take the current source node and work down the volume
	 * gradually in as much time as specified in the sustain property
	 * of the sound before stopping the source node.
	 */
	stopWithSustain: {
		enumerable: false,

		value: function(callback) {

			var node = this.sourceNode;
			var stopSound = function() {
				return Pz.Util.isFunction(node.stop) ? node.stop(0) : node.disconnect();
			};

			if (!this.sustain)
				stopSound();

			this.fadeNode.gain.setValueAtTime(this.fadeNode.gain.value, Pizzicato.context.currentTime);
			this.fadeNode.gain.linearRampToValueAtTime(0.00001, Pizzicato.context.currentTime + this.sustain);
			window.setTimeout(function() { stopSound(); }, this.sustain * 1000);
		}
	}
});
