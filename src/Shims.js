/* In order to allow an AudioNode to connect to a Pizzicato 
Effect object, we must shim its connect method */
var gainNode = Pizzicato.context.createGain();
var audioNode = Object.getPrototypeOf(Object.getPrototypeOf(gainNode));
var connect = audioNode.connect;

audioNode.connect = function(node) {
	var endpoint = Pz.Util.isEffect(node) ? node.inputNode : node;
	connect.call(this, endpoint);
	return node;
};