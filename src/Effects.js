Pizzicato.Effects = {};

var baseEffect = Object.create(null, {

	connect: {
		enumerable: true,

		value: function(audioNode) {
			this.outputNode.connect(audioNode);
			return this;
		}
	},

	disconnect: {
		enumerable: true,

		value: function(audioNode) {
			this.outputNode.disconnect(audioNode);
			return this;
		}
	}
});