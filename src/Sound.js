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

	onSourceLoad: function(buffer) {
		this.buffer = buffer;
	}
};