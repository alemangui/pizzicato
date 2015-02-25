(function(root) {
	'use strict';

	var Pizzicato = root.Pz = root.Pizzicato = {};
	Pizzicato.Sound = function(options) {
		this.context = new AudioContext();
	};
	
	Pizzicato.Sound.prototype = {
	
	};

	Pizzicato.Effect = function(options) {
		this.options = options;
	};
	
	Pizzicato.Effect.prototype = {
	
	};

	

	

	
	return Pizzicato;
})(this);