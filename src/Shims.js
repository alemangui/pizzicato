/**
 * In order to allow an AudioNode to connect to a Pizzicato 
 * Effect object, we must shim its connect method
 * Ref => https://github.com/GoogleChromeLabs/web-audio-samples/wiki/CompositeAudioNode
 */
var _connect = AudioNode.prototype.connect;
AudioNode.prototype.connect = function () {
  var args = Array.prototype.slice.call(arguments);
  if (args[0]._isPizzicatoEffectNode)
    args[0] = args[0].inputNode;
  
  _connect.apply(this, args);
};