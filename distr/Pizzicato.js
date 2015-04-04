(function(root) {
	'use strict';

	var Pizzicato = root.Pz = root.Pizzicato = {};
	Pizzicato.Util = {
	
		isString: function(arg) {
			return toString.call(arg) === '[object String]';
		},
	
		isObject: function(arg) {
			return toString.call(arg) === '[object Object]';
		},
	
		isFunction: function(arg) {
			return toString.call(arg) === '[object Function]';
		}
	
	};

	Pizzicato.Sound = function(options, callback) {
		var self = this;
	
		this.context = new AudioContext();
		this.lastTimePlayed = 0;
		this.effects = [];
	
		this.playing = false;
		this.paused = false;
	
		this.loop = Pz.Util.isObject(options) && options.loop;
	
		if (Pz.Util.isString(options))
			initializeWithUrl(options, callback);
	
		else if (Pz.Util.isObject(options) && Pz.Util.isString(options.source))
			initializeWithUrl(options.source, callback);
	
		else if (Pz.Util.isObject(options) && Pz.Util.isObject(options.wave))
			initializeWithWave(options.wave, callback);
	
		
		function initializeWithWave(waveOptions, callback) {
			self.getSourceNode = function() {
				var node = self.context.createOscillator();
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
				self.context.decodeAudioData(response, (function(buffer) {
					self.getSourceNode = function() {
						var node = this.context.createBufferSource();
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
	
			this.playing = true;
			this.paused = false;
	
			this.sourceNode = this.getSourceNode();
			this.sourceNode.onended = this.onEnded.bind(this);
	
	
			var lastNode = this.connectEffects(this.sourceNode);
	
			// TODO: add master volume
			lastNode.connect(this.context.destination);
	
			this.lastTimePlayed = this.context.currentTime;
			this.sourceNode.start(0, this.startTime || 0);
		},
	
		stop: function() {
			this.paused = false;
			this.playing = false;
			this.sourceNode.stop();
		},
	
		pause: function() {
			this.paused = true;
			this.playing = false;
			this.sourceNode.stop();
		},
	
		onEnded: function() {
			this.playing = false;
			this.startTime = this.paused ? this.context.currentTime - this.lastTimePlayed : 0;
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
		}
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
			this.options[key] = this.options[key] || defaults[key];
	};
	
	Pizzicato.Effects.Delay.prototype = {
	
		applyToNode: function(node) {
	
			var context = node.context;
			var currentNode = node;
	
			var dryGainNode = context.createGain();
			var wetGainNode = context.createGain();
			var masterGainNode = context.createGain();
	
			// TODO: do the mix
	
			node.connect(dryGainNode);
	
			for (var i = 0; i < this.options.repetitions; i++) {
	
				var delayNode = context.createDelay();
				delayNode.delayTime.value = this.options.time;
	
				var feedback = context.createGain();
				feedback.gain.value = 1 - (i * (1 / (this.options.repetitions)));
	
				currentNode.connect(delayNode);
				delayNode.connect(feedback);
				feedback.connect(wetGainNode);
	
				currentNode = delayNode;
			}
			
			dryGainNode.connect(masterGainNode);
			wetGainNode.connect(masterGainNode);
	
			return masterGainNode;
		}
	
	};

	

	
	return Pizzicato;
})(this);