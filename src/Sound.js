Pizzicato.Sound = function(options) {

	var self = this;
	this.context = new AudioContext();

	if (Pz.Util.isString(options))
		initializeWithUrl(options);

	else if (Pz.Util.isObject(options) && Pz.Util.isString(options.source))
		initializeWithUrl(options.source);

	else if (Pz.Util.isObject(options) && Pz.Util.isObject(options.wave))
		initializeWithWave(options.wave);

	function initializeWithUrl(url) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			self.context.decodeAudioData(request.response, (function(buffer) {
				this.mainAudioNode = this.context.createBufferSource();
				this.mainAudioNode.buffer = buffer;
				this.mainAudioNode.connect(this.context.destination);
			}).bind(self));
		};

		request.send();
	}

	function initializeWithWave(waveOptions) {
		self.mainAudioNode = self.context.createOscillator();
		self.mainAudioNode.type = waveOptions.type || 'sine';
		self.mainAudioNode.frequency.value = waveOptions.frequency || 440;
		self.mainAudioNode.connect(self.context.destination);
	}
};


Pizzicato.Sound.prototype = {

	play: function() {
		this.mainAudioNode.start(0);
	},

	stop: function() {
		this.mainAudioNode.stop();
	}
};