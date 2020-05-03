Pizzicato.Effects = {};

var baseEffect = Object.create(null, {

	_isPizzicatoEffectNode: {
		enumerable: true,

		get value () {
			return true;
		}
	},

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