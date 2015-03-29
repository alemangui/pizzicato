Pizzicato.Effects.Delay = function(options) {
	this.options = options = options || {};
	options.repeats = options.repeats || 5;
	options.time = options.time || 0.2;
};

Pizzicato.Effects.Delay.prototype = {

	applyToNode: function(node) {
		var context = node.context;
		var currentNode = node;

		for (var i = 0; i < this.options.repeats; i++) {
			var delayNode = context.createDelay();

			delayNode.delayTime.value = this.options.time;
			currentNode.connect(delayNode);
			delayNode.connect(context.destination);
			currentNode = delayNode;
		}
		
		return node;
	}

};