(function(root) {
	'use strict';

	var Pizzicato = root.Pz = root.Pizzicato = {};

	var Context = window.AudioContext || window.webkitAudioContext;

	Pizzicato.context = new Context();

	//= require ./Events.js
	//= require ./Util.js
	//= require ./Sound.js
	//= require ./Effects.js
	//= require ./Effects/Delay.js
	//= require ./Effects/Compressor.js
	//= require ./Effects/Filters.js
	//= require ./Effects/Distortion.js
	//= require ./Effects/Flanger.js
	
	return Pizzicato;
})(this);