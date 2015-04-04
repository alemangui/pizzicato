Pizzicato.Sound = function(options, callback) {
	var self = this;

	this.lastTimePlayed = 0;
	this.effects = [];

	this.playing = false;
	this.paused = false;

	this.loop = Pz.Util.isObject(options) && options.loop;
	this.volume = Pz.Util.isObject(options) && options.volume ? options.volume : 1;

	if (Pz.Util.isString(options))
		initializeWithUrl(options, callback);

	else if (Pz.Util.isObject(options) && Pz.Util.isString(options.source))
		initializeWithUrl(options.source, callback);

	else if (Pz.Util.isObject(options) && Pz.Util.isObject(options.wave))
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
		this.startTime = this.paused ? Pizzicato.context.currentTime - this.lastTimePlayed : 0;
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
	}
};