Pizzicato.Sound = function(options, callback) {
	var self = this;
	var util = Pizzicato.Util;

	this.lastTimePlayed = 0;
	this.effects = [];
	this.playing = false;
	this.paused = false;

	this.masterVolume = Pizzicato.context.createGain();
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


Pizzicato.Sound.prototype = Object.create(Pizzicato.Events, {

	play: {
		value: function() {
			if (this.playing) return;

			this.playing = true;
			this.paused = false;
			this.sourceNode = this.getSourceNode();
			this.sourceNode.onended = this.onEnded.bind(this);

			var lastNode = this.connectEffects(this.sourceNode);

			lastNode.connect(this.masterVolume);
			lastNode.connect(Pizzicato.context.destination);

			this.lastTimePlayed = Pizzicato.context.currentTime;
			this.sourceNode.start(0, this.startTime || 0);

			this.trigger('play');
		}
	},

	stop: {
		value: function() {
			this.paused = false;
			this.playing = false;
			this.sourceNode.stop();
			this.trigger('stop');
		}
	},

	pause: {
		value: function() {
			this.paused = true;
			this.playing = false;
			this.sourceNode.stop();
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
		}
	},

	removeEffect: {
		value: function(effect) {
			var index = this.effects.indexOf(effect);

			if (index !== -1)
				this.effects.splice(index, 1);
		}
	},

	connectEffects: {
		value: function(sourceNode) {
			var currentNode = sourceNode;

			for (var i = 0; i < this.effects.length; i++) 
				currentNode = this.effects[i].applyToNode(currentNode);

			return currentNode;
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
	}
});