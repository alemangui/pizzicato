(function(root) {
	'use strict';

	var AudioContext = window.AudioContext || window.webkitAudioContext; 

	var Pizzicato = root.Pz = root.Pizzicato = {};
	Pizzicato.context = new AudioContext();

	var masterGainNode = Pizzicato.context.createGain();
	masterGainNode.connect(Pizzicato.context.destination);

	//= require ./Util.js

	Object.defineProperty(Pizzicato, 'volume', {
		enumerable: true,
			
		get: function() {
			return masterGainNode.gain.value;
		},

		set: function(volume) {
			if (Pz.Util.isInRange(volume, 0, 1) && masterGainNode)
				masterGainNode.gain.value = volume;
		}
	});

	Object.defineProperty(Pizzicato, 'masterGainNode', {
		enumerable: false,

		get: function() {
			return masterGainNode;
		},

		set: function(volume) {
			console.error('Can\'t set the master gain node');
		}
	});
	
	//= require ./Events.js
	//= require ./Sound.js
	//= require ./Effects.js
	//= require ./Effects/Delay.js
	//= require ./Effects/Compressor.js
	//= require ./Effects/Filters.js
	//= require ./Effects/Distortion.js
	//= require ./Effects/Flanger.js
	//= require ./Effects/Convolver.js
	
	return Pizzicato;
})(this);