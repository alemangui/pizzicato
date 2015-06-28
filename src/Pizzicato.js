(function(root) {
	'use strict';

	var Pizzicato = root.Pz = root.Pizzicato = {};

	var Context = window.AudioContext || window.webkitAudioContext;

	Pizzicato.context = new Context();

	//= include ./Events.js
	//= include ./Util.js
	//= include ./Sound.js
	//= include ./Effects.js
	//= include ./Effects/Delay.js
	//= include ./Effects/Compressor.js
	//= include ./Effects/LowPassFilter.js
	
	return Pizzicato;
})(this);