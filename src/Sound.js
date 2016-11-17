Pizzicato.Sound = function(description, callback) {
	var self = this;
	var util = Pizzicato.Util;
	var descriptionError = getDescriptionError(description);
	var hasOptions = util.isObject(description) && util.isObject(description.options);
	var defaultAttack = 0.04;
	var defaultRelease = 0.04;

	if (descriptionError) {
		console.error(descriptionError);
		throw new Error('Error initializing Pizzicato Sound: ' + descriptionError);
	}

	this.masterVolume = Pizzicato.context.createGain();
	this.fadeNode = Pizzicato.context.createGain();
	
	if (!hasOptions || !description.options.detached)
		this.masterVolume.connect(Pizzicato.masterGainNode);

	this.lastTimePlayed = 0;
	this.time = 0;
	this.effects = [];
	this.playing = this.paused = false;
	this.loop = hasOptions && description.options.loop;
	this.attack = hasOptions && util.isNumber(description.options.attack) ? description.options.attack : defaultAttack;
	this.volume = hasOptions && util.isNumber(description.options.volume) ? description.options.volume : 1;
	this.currentPlaybackRate = 1.0;
	this.lastPBR = this.currentPlaybackRate;

	if (hasOptions && util.isNumber(description.options.release)) {
		this.release = description.options.release;
	} else if (hasOptions && util.isNumber(description.options.sustain)) {
		console.warn('\'sustain\' is deprecated. Use \'release\' instead.');
		this.release = description.options.sustain;
	} else {
		this.release = defaultRelease;
	}

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

	else if (description.source === 'sound')
		(initializeWithSoundObject.bind(this))(description.options, callback);


	function getDescriptionError(description) {
		var supportedSources = ['wave', 'file', 'input', 'script', 'sound'];

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


	function initializeWithWave(waveOptions, callback) {
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


	function initializeWithUrl(paths, callback) {
		paths = util.isArray(paths) ? paths : [paths];

		var request = new XMLHttpRequest();
		request.open('GET', paths[0], true);
		request.responseType = 'arraybuffer';

		if(this.counter) {
			clearInterval(this.counter);
		}

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

		this.counter = setInterval(function(){
			calculateFileTime();
        }.bind(this), 10);

		request.onreadystatechange = function(event) {

			if (request.readyState === 4 && request.status !== 200)
				console.error('Error while fetching ' + paths[0] + '. ' + request.statusText);
		};
		request.send();
	}


	function initializeWithInput(options, callback) {
		navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

		if (!navigator.getUserMedia) return;

		navigator.getUserMedia({
			audio: true
		}, (function(stream) {
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


	function initializeWithSoundObject(options, callback) {
		this.getRawSourceNode = options.sound.getRawSourceNode;

		if (options.sound.sourceNode && Pz.Util.isOscillator(options.sound.sourceNode)) {
			this.sourceNode = this.getRawSourceNode();
			this.frequency = options.sound.frequency;
		}
	}

	function calculateFileTime(options, callback) {
		if(self.playing) {
			var rate = self.sourceNode.playbackRate.value;
	        var now = Pizzicato.context.currentTime;

	        if (self.lastTimePlayed > now){
	            return; 
	        }

	        self.time += (now - self.lastTimePlayed) * self.lastPBR;
	        self.lastPBR = rate;
	        self.lastTimePlayed = now;
	    }
	}
};


Pizzicato.Sound.prototype = Object.create(Pizzicato.Events, {

	play: {
		enumerable: true,

		value: function(when, offset) {

			if (this.playing)
				return;

			if (!Pz.Util.isNumber(offset))
				offset = this.offsetTime || 0;

			if (!Pz.Util.isNumber(when))
				when = 0;

			this.playing = true;
			this.paused = false;
			this.sourceNode = this.getSourceNode();
			this.time = offset;

			this.applyAttack();

			if (Pz.Util.isFunction(this.sourceNode.start)) {
				this.lastTimePlayed = Pizzicato.context.currentTime - offset;
				this.sourceNode.start(Pz.context.currentTime + when, offset);
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
			this.stopWithRelease();

			this.offsetTime = 0;
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

			this.stopWithRelease();

			var elapsedTime = Pz.context.currentTime - this.lastTimePlayed;
			
			// If we are using a buffer node - potentially in loop mode - we need to
			// know where to re-start the sound independently of the loop it is in.
			if (this.sourceNode.buffer)
				this.offsetTime = elapsedTime % (this.sourceNode.buffer.length / Pz.context.sampleRate);
			else
				this.offsetTime = elapsedTime;

			this.trigger('pause');
		}
	},


	clone: {
		enumerable: true,

		value: function() {
			var clone = new Pizzicato.Sound({
				source: 'sound',
				options: {
					loop: this.loop,
					attack: this.attack,
					release: this.release,
					volume: this.volume,
					sound: this
				}
			});

			for (var i = 0; i < this.effects.length; i++)
				clone.addEffect(this.effects[i]);

			return clone;
		}
	},


	onEnded: {
		enumerable: true,

		value: function() {
			if (this.playing)
				this.stop();
			if (!this.paused)
				this.trigger('end');
		}
	},

	addEffect: {
		enumerable: true,

		value: function(effect) {
			if (!effect || !Pz.Util.isEffect(effect)) {
				console.warn('Invalid effect.');
				return;
			}

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

			if (index === -1) {
				console.warn('Cannot remove effect that is not applied to this sound.');
				return;
			}

			var shouldResumePlaying = this.playing;

			if (shouldResumePlaying)
				this.pause();

			this.fadeNode.disconnect();

			for (var i = 0; i < this.effects.length; i++)
				this.effects[i].outputNode.disconnect();

			this.effects.splice(index, 1);
			this.connectEffects();

			if (shouldResumePlaying)
				this.play();
		}
	},


	connect: {
		enumerable: true,

		value: function(audioNode) {
			this.masterVolume.connect(audioNode);
		}
	},


	disconnect: {
		enumerable: true,

		value: function(audioNode) {
			this.masterVolume.disconnect(audioNode);
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
 	 * @deprecated - Use "release"
	 */
	sustain: {
		enumerable: true,

		get: function() {
			console.warn('\'sustain\' is deprecated. Use \'release\' instead.');
			return this.release;
		},

		set: function(sustain){
			console.warn('\'sustain\' is deprecated. Use \'release\' instead.');

			if (Pz.Util.isInRange(sustain, 0, 10))
				this.release = sustain;
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
 	 * @deprecated - Use "connect"
 	 *
	 * Returns an analyser node located right after the master volume.
	 * This node is created lazily.
	 */
	getAnalyser: {
		enumerable: true,

		value: function() {

			console.warn('This method is deprecated. You should manually create an AnalyserNode and use connect() on the Pizzicato Sound.');

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
	 * gradually in as much time as specified in the release property
	 * of the sound before stopping the source node.
	 */
	stopWithRelease: {
		enumerable: false,

		value: function(callback) {

			var node = this.sourceNode;
			var stopSound = function() {
				return Pz.Util.isFunction(node.stop) ? node.stop(0) : node.disconnect();
			};

			if (!this.release)
				stopSound();

			this.fadeNode.gain.setValueAtTime(this.fadeNode.gain.value, Pizzicato.context.currentTime);
			this.fadeNode.gain.linearRampToValueAtTime(0.00001, Pizzicato.context.currentTime + this.release);
			window.setTimeout(function() {
				stopSound();
			}, this.release * 1000);
		}
	}
});