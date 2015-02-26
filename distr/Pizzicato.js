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
		this.context = new AudioContext();
	
		if (Pz.Util.isString(options))
			initializeWithUrl(options);
	
		if (Pz.Util.isObject(options) && Pz.Util.isString(options.source))
			initializeWithUrl(options.source);
	
		var initializeWithUrl = function(url) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
	
			request.onload = function() {
				self.context.decodeAudioData(request.response, self.onSourceLoad.bind(self));
			};
	
			request.send();
		};
	};
	
	
	Pizzicato.Sound.prototype = {
	
		play: function() {
			var audioBufferNode = this.context.createBufferSource();
	
			audioBufferNode.buffer = this.buffer;
			audioBufferNode.connect(this.context.destination);
			audioBufferNode.start(0);
		},
	
		stop: function() {
	
		},
	
		onSourceLoad: function(buffer) {
			this.buffer = buffer;
		}
	};

	Pizzicato.Effect = function(options) {
		this.options = options;
	};
	
	Pizzicato.Effect.prototype = {
	
	};

	

	

	
	return Pizzicato;
})(this);