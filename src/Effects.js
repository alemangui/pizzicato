Pizzicato.Effects = {};

var baseEffect = Object.create(null, {

	connect: {
		enumerable: true,

		value: function(audioNode) {
			this.outputNode.connect(audioNode);
		}
	},

	disconnect: {
		enumerable: true,

		value: function(audioNode) {
			this.outputNode.disconnect(audioNode);
		}
	}
});