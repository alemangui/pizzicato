(function(root) {
	'use strict';

	var Pizzicato = root.Pz = root.Pizzicato = {};

	Pizzicato.context = new AudioContext();

	//= include ./Util.js
	//= include ./Sound.js
	//= include ./Effects.js
	//= include ./Effects/Delay.js
	//= include ./Instruments/Synth.js
	
	return Pizzicato;
})(this);