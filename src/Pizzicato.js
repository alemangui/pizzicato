(function(root) {
	'use strict';

	var Pizzicato = root.Pz = root.Pizzicato = {};

	Pizzicato.context = new (window.AudioContext || window.webkitAudioContext)();

	//= include ./Events.js
	//= include ./Util.js
	//= include ./Sound.js
	//= include ./Effects.js
	//= include ./Effects/Delay.js
	//= include ./Effects/Compressor.js
	//= include ./Instruments/Synth.js
	
	return Pizzicato;
})(this);