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