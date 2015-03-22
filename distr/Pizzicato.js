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
		this.loop = Pz.Util.isObject(options) && options.loop;
		this.lastTimePlayed = 0;
	
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
			callback && callback();
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
					callback && callback();
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
			this.sourceNode.connect(this.context.destination);
	
			this.lastTimePlayed = this.context.currentTime;
	
			this.sourceNode.start(0, this.startTime || 0);
		},
	
		stop: function() {
			this.paused = false;
			this.sourceNode.stop();
		},
	
		pause: function() {
			this.paused = true;
			this.sourceNode.stop();
		},
	
		onEnded: function() {
			this.playing = false;
			this.startTime = this.paused ? this.context.currentTime - this.lastTimePlayed : 0;
		}
	};

	Pizzicato.Effect = function(options) {
		this.options = options;
	};
	
	Pizzicato.Effect.prototype = {
	
	};

	

	

	
	return Pizzicato;
})(this);