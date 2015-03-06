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

	Pizzicato.Sound = function(options) {
	
		var self = this;
		var initializeWithWave;
		var initializeWithUrl;
	
		this.context = new AudioContext();
	
		if (Pz.Util.isString(options))
			initializeWithUrl(options);
	
		else if (Pz.Util.isObject(options) && Pz.Util.isString(options.source))
			initializeWithUrl(options.source);
	
		else if (Pz.Util.isObject(options) && Pz.Util.isObject(options.wave))
			initializeWithWave(options.wave);
	
		
		function initializeWithWave(waveOptions) {
			self.getSourceNode = function() {
				var node = self.context.createOscillator();
				node.type = waveOptions.type || 'sine';
				node.frequency.value = waveOptions.frequency || 440;
	
				return node;
			};
		}
	
	
		function initializeWithUrl(url) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			request.onload = function(progressEvent) {
	
				var response = progressEvent.target.response;
	
				self.context.decodeAudioData(response, (function(buffer) {
					self.getSourceNode = function() {
						var node = this.context.createBufferSource();
						node.buffer = buffer;
						return node;
					};
				}).bind(self));
			};
	
			request.send();
		}
	
	};
	
	
	Pizzicato.Sound.prototype = {
	
		play: function() {
			var sourceNode = this.getSourceNode();
			sourceNode.connect(this.context.destination);
			sourceNode.start(0);
		},
	
		stop: function() {
			this.mainAudioNode.stop();
		}
	};

	Pizzicato.Effect = function(options) {
		this.options = options;
	};
	
	Pizzicato.Effect.prototype = {
	
	};

	

	

	
	return Pizzicato;
})(this);