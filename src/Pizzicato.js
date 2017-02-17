(function(root) {
	'use strict';

	var Pizzicato = {};
	var Pz = Pizzicato;
	var commonJS = typeof module === "object" && module.exports;
	var amd = typeof define === "function" && define.amd;

	if (commonJS)
		module.exports = Pizzicato;
	else if (amd)
		define([], Pizzicato);
	else
		root.Pizzicato = root.Pz = Pizzicato;

	var AudioContext = root.AudioContext || root.webkitAudioContext; 

	if (!AudioContext) {
		console.error('No AudioContext found in this environment. Please ensure your window or global object contains a working AudioContext constructor function.');
		return;
	}

	Pizzicato.context = new AudioContext();

	var masterGainNode = Pizzicato.context.createGain();
	masterGainNode.connect(Pizzicato.context.destination);

	//= require ./Util.js
	//= require ./Shims.js

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
	//= require ./Group.js
	//= require ./Effects.js
	//= require ./Effects/Delay.js
	//= require ./Effects/Compressor.js
	//= require ./Effects/Filters.js
	//= require ./Effects/Distortion.js
	//= require ./Effects/Flanger.js
	//= require ./Effects/StereoPanner.js
	//= require ./Effects/Convolver.js
	//= require ./Effects/PingPongDelay.js
	//= require ./Effects/Reverb.js
	//= require ./Effects/Tremolo.js
	//= require ./Effects/DubDelay.js
	//= require ./Effects/RingModulator.js
	//= require ./Effects/Quadrafuzz.js
	
	return Pizzicato;
})(typeof window !== "undefined" ? window : global);