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
	//= include ./Effects/Filters.js
	//= include ./Effects/Distortion.js
	//= include ./Effects/Flanger.js
	
	return Pizzicato;
})(this);