(function(root) {
	'use strict';

	var Pizzicato = root.Pz = root.Pizzicato = {};

	Pizzicato.context = new AudioContext();
	Pizzicato.Events = {
	
		/**
		 * Adds an event handler that will be treated upon
		 * the triggering of that event.
		 */
		on: function(name, callback, context) {
			if (!name || !callback)
				return;
	
			this._events = this._events || {};
			var _event = this._events[name] || (this._events[name] = []);
	
			_event.push({
				callback: callback,
				context: context || this,
				handler: this
			});
		},
	
		/**
		 * Triggers a particular event. If a handler
		 * is linked to that event, the handler will be
		 * executed.
		 */
		trigger: function(name) {
			if (!name)
				return;
	
			var _event, length, args, i;
	
			this._events = this._events || {};
			_event = this._events[name] || (this._events[name] = []);
	
			if (!_event)
				return;
	
			length = Math.max(0, arguments.length - 1);
	    args = [];
	    for (i = 0; i < length; i++) args[i] = arguments[i + 1];
	
	    for (i = 0; i < _event.length; i++)
				_event[i].callback.apply(_event[i].context, args);	
		},
	
		/**
		 * Removes an event handler. If no name is provided,
		 * all handlers for this object will be removed.
		 */
		off: function(name) {
			if (name)
				this._events[name] = undefined;
	
			else
				this._events = {};
		}
	
	};

	Pizzicato.Util = {
	
		isString: function(arg) {
			return toString.call(arg) === '[object String]';
		},
	
		isObject: function(arg) {
			return toString.call(arg) === '[object Object]';
		},
	
		isFunction: function(arg) {
			return toString.call(arg) === '[object Function]';
		},
	
		isNumber: function(arg) {
			return toString.call(arg) === '[object Number]' && arg === +arg;
		},
	
		isInRange: function(arg, min, max) {
			if (!Pz.Util.isNumber(arg) || !Pz.Util.isNumber(min) || !Pz.Util.isNumber(max))
				return false;
	
			return arg >= min && arg <= max;
		},
	
		getDryLevel: function(mix) {
			if (!Pz.Util.isNumber(mix) || mix > 1 || mix < 0)
				return 0;
	
			if (mix <= 0.5)
				return 1;
	
			return 1 - ((mix - 0.5) * 2);
		},
	
		getWetLevel: function(mix) {
			if (!Pz.Util.isNumber(mix) || mix > 1 || mix < 0)
				return 0;
	
			if (mix >= 0.5)
				return 1;
	
			return 1 - ((0.5 - mix) * 2);
		}
	
	};

	Pizzicato.Sound = function(options, callback) {
		var self = this;
		var util = Pizzicato.Util;
	
		this.lastTimePlayed = 0;
		this.effects = [];
	
		this.playing = false;
		this.paused = false;
	
		this.loop = util.isObject(options) && options.loop;
		this.volume = util.isObject(options) && options.volume ? options.volume : 1;
	
		if (util.isString(options))
			initializeWithUrl(options, callback);
	
		else if (util.isObject(options) && util.isString(options.source))
			initializeWithUrl(options.source, callback);
	
		else if (util.isObject(options) && util.isObject(options.wave))
			initializeWithWave(options.wave, callback);
	
	
		function initializeWithWave(waveOptions, callback) {
			self.getSourceNode = function() {
				var node = Pizzicato.context.createOscillator();
				node.type = waveOptions.type || 'sine';
				node.frequency.value = waveOptions.frequency || 440;
	
				return node;
			};
			if (Pz.Util.isFunction(callback)) 
				callback();
		}
	
	
		function initializeWithUrl(url, callback) {
			var request = new XMLHttpRequest();
	
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			request.onload = function(progressEvent) {
				var response = progressEvent.target.response;
				Pizzicato.context.decodeAudioData(response, (function(buffer) {
					self.getSourceNode = function() {
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
	};
	
	
	Pizzicato.Sound.prototype = {
	
		play: function() {
			if (this.playing) return;
	
			var lastNode;
	
			this.playing = true;
			this.paused = false;
	
			this.sourceNode = this.getSourceNode();
			this.sourceNode.onended = this.onEnded.bind(this);
	
			lastNode = this.connectEffects(this.sourceNode);
	
			this.masterVolume = this.getMasterVolumeNode();
			lastNode.connect(this.masterVolume);
			lastNode.connect(Pizzicato.context.destination);
	
			this.lastTimePlayed = Pizzicato.context.currentTime;
			this.sourceNode.start(0, this.startTime || 0);
	
			this.trigger('play');
		},
	
		stop: function() {
			this.paused = false;
			this.playing = false;
			this.sourceNode.stop();
			this.trigger('stop');
		},
	
		pause: function() {
			this.paused = true;
			this.playing = false;
			this.sourceNode.stop();
			this.trigger('pause');
		},
	
		onEnded: function() {
			this.playing = false;
			this.startTime = this.paused ? Pizzicato.context.currentTime - this.lastTimePlayed : 0;
			this.trigger('stop');
			this.trigger('end');
		},
	
		addEffect: function(effect) {
			this.effects.push(effect);
		},
	
		removeEffect: function(effect) {
			var index = this.effects.indexOf(effect);
	
			if (index !== -1)
				this.effects.splice(index, 1);
		},
	
		connectEffects: function(sourceNode) {
			var currentNode = sourceNode;
	
			for (var i = 0; i < this.effects.length; i++) 
				currentNode = this.effects[i].applyToNode(currentNode);
	
			return currentNode;
		},
	
		setVolume: function(volume) {
			if(volume < 0 || volume > 1) return;
	
			this.volume = volume;
			
			if (this.playing) 
				this.masterVolume.gain.value = this.volume;
		},
	
		getMasterVolumeNode: function() {
			var masterVolume = Pizzicato.context.createGain();
			masterVolume.gain.value = this.volume;
			return masterVolume;
		},
	
		on: Pizzicato.Events.on,
		off: Pizzicato.Events.off,
		trigger: Pizzicato.Events.trigger
	};

	Pizzicato.Effects = {};

	Pizzicato.Effects.Delay = function(options) {
	
		this.options = options || {};
	
		var defaults = {
			repetitions: 5,
			time: 0.3,
			mix: 0.5
		};
	
		for (var key in defaults)
			this.options[key] = typeof this.options[key] === 'undefined' ? defaults[key] : this.options[key];
	
		this.inputGainNode = Pizzicato.context.createGain();
		this.dryGainNode = Pizzicato.context.createGain();
		this.wetGainNode = Pizzicato.context.createGain();
		this.outputGainNode = Pizzicato.context.createGain();
	
		this.adjustMix();
	
		this.inputGainNode.connect(this.dryGainNode);
		this.dryGainNode.connect(this.outputGainNode);
		this.wetGainNode.connect(this.outputGainNode);
	
		this.createDelayLoop();	
	};
	
	Pizzicato.Effects.Delay.prototype = Object.create(null, {
	
		/**
		 * Applies the delay effect to a node and 
		 * returns the master gain node;
		 * @type {Function}
		 */
		applyToNode: {
	
			writable: false,
	
			configurable: false,
	
			enumerable: true,
	
			value: function(node) {
				node.connect(this.inputGainNode);
				return this.outputGainNode;
			}
		},
	
		/**
		 * Gets and sets the dry/wet mix.
		 */
		mix: {
			get: function() {
				return this.options.mix	;	
			},
	
			set: function(mix) {
				if (!Pz.Util.isInRange(mix, 0, 1))
					return;
	
				this.options.mix = mix;
				this.adjustMix();
			}
		},
	
		/**
		 * Time between each delay loop
		 */
		time: {
			get: function() {
				return this.options.time;	
			},
	
			set: function(time) {
				if (!Pz.Util.isInRange(time, 0, 180))
					return;
	
				this.options.time = time;
				this.adjustTime();
			}
		},
	
		/**
		 * Number of delayed sounds
		 */
		repetitions: {
			get: function() {
				return this.options.repetitions	;	
			},
	
			set: function(repetitions) {
				if (!Pz.Util.isInRange(repetitions, 0, 50))
					return;
	
				this.options.repetitions = parseInt(repetitions, 10);
				this.createDelayLoop();
			}
		},
	
		/**
		 * Creates the loop with delay nodes. If a previous
		 * delay loop exists, it disconnects it an re-creates it.
		 */
		createDelayLoop: {
			writable: false,
			configurable: false,
			enumerable: true,
			value: function() {
				var i;
	
				if (this.delayLoop && this.delayLoop.length > 0) {
					for (i = 0; i < this.delayLoop.length; i++) {
						this.delayLoop[i].delay.disconnect();
						this.delayLoop[i].feedback.disconnect();
					}
				}
	
				this.delayLoop = [];
	
				for (i = 0; i < this.repetitions; i++) {
					
					var delay = Pizzicato.context.createDelay();
					var feedback = Pizzicato.context.createGain();
					var parentNode = (i === 0) ? this.inputGainNode : this.delayLoop[i - 1].delay;
					
					delay.delayTime.value = this.time;
					feedback.gain.value = 1 - (i * (1 / (this.repetitions)));
	
					delay.connect(feedback);
					feedback.connect(this.wetGainNode);
					parentNode.connect(delay);
	
					this.delayLoop.push({ delay: delay, feedback: feedback });
				}				
			}
		},
	
		/**
		 * Ensures the time of the delay nodes 
		 * in the delay loop is correct
		 */
		adjustTime: {
			writable: false,
			configurable: false,
			enumerable: true,
			value: function() {
	
				for (var i = 0; i < this.delayLoop.length; i++)
					this.delayLoop[i].delay.delayTime.value = this.time;
			}
		},
	
		/**
		 * Ensures the dry/wet mix is correct.
		 */
		adjustMix: {
			writable: false,
			configurable: false,
			enumerable: true,
			value: function() {
				this.dryGainNode.gain.value = Pizzicato.Util.getDryLevel(this.mix);
				this.wetGainNode.gain.value = Pizzicato.Util.getWetLevel(this.mix);
			}
		}
	
	});

	Pizzicato.Effects.Compressor = function(options) {
	
		this.options = options || {};
	
		var defaults = {
			threshold: -24, 		
			knee: 30,
			attack: 0.003,
			release: 0.250,
			ratio: 12
		};
	
		this.compressorNode = Pizzicato.context.createDynamicsCompressor();
		this.outputGainNode = Pizzicato.context.createGain();
		
		this.compressorNode.connect(this.outputGainNode);
	
		for (var key in defaults)
			this[key] = typeof this.options[key] === 'undefined' ? defaults[key] : this.options[key];
	};
	
	Pizzicato.Effects.Compressor.prototype = Object.create(null, {
	
		/**
		 * Applies the compression effect to a node and 
		 * returns the master gain node.
		 * @type {Function}
		 */
		applyToNode: {
	
			writable: false,
	
			configurable: false,
	
			enumerable: true,
	
			value: function(node) {
				node.connect(this.compressorNode);
				return this.outputGainNode;
			}
		},
	
		/**
		 * The level above which compression is applied to the audio.
		 * MIN: -100
		 * MAX: 0
		 */
		threshold: {
			get: function() {
				return this.compressorNode.threshold.value;
			},
			set: function(value) {
				if (Pizzicato.Util.isInRange(value, -100, 0))
					this.compressorNode.threshold.value = value;
			}
		},
	
		/**
		 * A value representing the range above the threshold where 
		 * the curve smoothly transitions to the "ratio" portion. More info:
		 * http://www.homestudiocorner.com/what-is-knee-on-a-compressor/
		 * MIN 0
		 * MAX 40
		 */
		knee: {
			get: function() {
				return this.compressorNode.knee.value;
			},
			set: function(value) {
				if (Pizzicato.Util.isInRange(value, 0, 40))
					this.compressorNode.knee.value = value;
			}
		},
	
		/**
		 * How soon the compressor starts to compress the dynamics after 
		 * the threshold is exceeded. If volume changes are slow, you can 
		 * push this to a high value. Short attack times will result in a 
		 * fast response to sudden, loud sounds, but will make the changes 
		 * in volume much more obvious to listeners.
		 * MIN 0
		 * MAX 1
		 */
		attack: {
			get: function() {
				return this.compressorNode.attack.value;
			},
			set: function(value) {
				if (Pizzicato.Util.isInRange(value, 0, 1))
					this.compressorNode.attack.value = value;
			}
		},
	
		/**
		 * How soon the compressor starts to release the volume level 
		 * back to normal after the level drops below the threshold. 
		 * A long time value will tend to lose quiet sounds that come 
		 * after loud ones, but will avoid the volume being raised too 
		 * much during short quiet sections like pauses in speech.
		 * MIN 0
		 * MAX 1
		 */
		release: {
			get: function() {
				return this.compressorNode.release.value;
			},
			set: function(value) {
				if (Pizzicato.Util.isInRange(value, 0, 1))
					this.compressorNode.release.value = value;
			}
		},
	
		/**
		 * The amount of compression applied to the audio once it 
		 * passes the threshold level. The higher the Ratio the more 
		 * the loud parts of the audio will be compressed.
		 * MIN 1
		 * MAX 20
		 */
		ratio: {
			get: function() {
				return this.compressorNode.ratio.value;
			},
			set: function(value) {
				if (Pizzicato.Util.isInRange(value, 1, 20))
					this.compressorNode.ratio.value = value;
			}
		},
	
		getCurrentGainReduction: function() {
			return this.compressorNode.reduction;
		}
	
	});

	

	
	return Pizzicato;
})(this);