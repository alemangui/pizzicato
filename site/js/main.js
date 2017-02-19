// Dolby format detection - taken from https://s3-us-west-1.amazonaws.com/dolbydeveloper/1.1.0/js/dolby.min.js
var Dolby=Dolby||{};!function(){"use strict";Dolby.supportDDPlus=!1;var e=new Audio;""!=e.canPlayType('audio/mp4;codecs="ec-3"')&&(-1==navigator.userAgent.indexOf("CPU iPhone OS 9_3")&&-1==navigator.userAgent.indexOf("CPU OS 9_3")||-1==navigator.userAgent.indexOf("Safari")||-1==navigator.userAgent.indexOf("Version/9")||(Dolby.supportDDPlus=!0),-1!=navigator.userAgent.indexOf("Mac OS X 10_1")&&-1!=navigator.userAgent.indexOf("Safari")&&-1!=navigator.userAgent.indexOf("Version/9")&&(Dolby.supportDDPlus=!0),-1!=navigator.userAgent.indexOf("Edge")&&(Dolby.supportDDPlus=!0),-1!=navigator.userAgent.indexOf("Windows Phone 10")&&(Dolby.supportDDPlus=!1)),Dolby.checkDDPlus=function(){return Dolby.supportDDPlus}}();
var dolbySupported = Dolby.checkDDPlus();

// Effects
var delay = new Pizzicato.Effects.Delay({
  feedback: 0.6,
  time: 0.4,
  mix: 0.5
});
var pingPongDelay = new Pizzicato.Effects.PingPongDelay({
	feedback: 0.6,
	time: 0.4,
	mix: 0.5
});
var dubDelay = new Pizzicato.Effects.DubDelay({
	feedback: 0.6,
	time: 0.7,
	mix: 0.5,
	cutoff: 700
});

var compressor = new Pizzicato.Effects.Compressor({
	threshold: -24,
	ratio: 12
});
var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
	frequency: 400,
	peak: 10
});
var highPassFilter = new Pizzicato.Effects.HighPassFilter({
	frequency: 10,
	peak: 10
});
var distortion = new Pizzicato.Effects.Distortion({
	gain: 0.4
});
var quadrafuzz = new Pizzicato.Effects.Quadrafuzz();
var flanger = new Pizzicato.Effects.Flanger();
var stereoPanner = new Pizzicato.Effects.StereoPanner();
var reverb = new Pizzicato.Effects.Reverb();
var convolver = new Pizzicato.Effects.Convolver({ impulse: './audio/scala-milan.wav' });
var tremolo = new Pizzicato.Effects.Tremolo({
	speed: 7,
	mix: 0.8,
	depth: 0.8
});
var ringModulator = new Pizzicato.Effects.RingModulator({
	speed: 30,
	distortion: 1,
	mix: 0.5
});

// Sounds
var sineWave = new Pz.Sound();
var sineWaveRelease = new Pz.Sound({ source: 'wave', options: { frequency: 220, release: 1, attack:0.5 } });
var acoustic = new Pz.Sound(dolbySupported ? './audio/acoustic_Dolby.mp4' : './audio/acoustic.mp3');

var timba = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: dolbySupported ? './audio/timba_Dolby.mp4' : './audio/timba.mp3', 
		loop: true 
	}
}, function() { timba.addEffect(delay); });

var electro = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: dolbySupported ? './audio/electro_Dolby.mp4' : './audio/electro.mp3', 
		loop: true 
	}
}, function() { electro.addEffect(compressor); });

var synth = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: dolbySupported ? './audio/synth_Dolby.mp4' : './audio/synth.mp3', 
		loop: true 
	}
}, function() { synth.addEffect(lowPassFilter); });

var synth2 = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: dolbySupported ? './audio/synth2_Dolby.mp4' : './audio/synth2.mp3', 
		loop: true 
	}
}, function() { synth2.addEffect(highPassFilter); });

var guitar = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: dolbySupported ? './audio/guitar_Dolby.mp4' : './audio/guitar.mp3', 
		loop: true 
	}
}, function() { guitar.addEffect(distortion); });

var walkGuitar = new Pz.Sound({
	source: 'file',
	options: {
		path: './audio/uttl.mp3',
		loop: true
	}
}, function() { walkGuitar.addEffect(quadrafuzz); });

var electricGuitar = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: dolbySupported ? './audio/electric-guitar_Dolby.mp4' : './audio/electric-guitar.mp3', 
		loop: true 
	}
}, function() { electricGuitar.addEffect(flanger); });

var wah = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: './audio/wah.mp3', 
		loop: true 
	}
}, function() { wah.addEffect(pingPongDelay); });

var chop = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: './audio/chop.mp3', 
		loop: true 
	}
}, function() { chop.addEffect(dubDelay); });

var stanceBass = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: './audio/stance-bass.mp3', 
		loop: true 
	}
}, function() { stanceBass.addEffect(stereoPanner); });

var cavaquinho = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: './audio/cavaquinho.mp3', 
		loop: true 
	}
}, function() { cavaquinho.addEffect(reverb); });

var drums = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: './audio/drums.mp3', 
		loop: true 
	}
}, function() { 
	drums.addEffect(convolver); 
});

var tremoloGuitar = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: './audio/tremolo-guitar.mp3', 
		loop: true
	}
}, function() { 
	tremoloGuitar.addEffect(tremolo); 
});

var whiteNoise = new Pz.Sound(function(e) {
  var output = e.outputBuffer.getChannelData(0);
  for (var i = 0; i < e.outputBuffer.length; i++)
    output[i] = Math.random();
});

var voice = new Pizzicato.Sound({ source: 'input' }, function(err) {
	if (!err) return;
	document.getElementById('play-voice').setAttribute('disabled', 'disabled');
	document.getElementById('stop-voice').setAttribute('disabled', 'disabled');
	document.getElementById('volume-voice').setAttribute('disabled', 'disabled');
	document.getElementById('microphone-error').style.display = 'block';
});

var countdown = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: './audio/countdown.mp3', 
		loop: true 
	}
}, function() { 
	countdown.addEffect(ringModulator); 
});

var guitarGroup = new Pz.Sound({ source: 'file', options: {
	path: './audio/guitar-group.mp3',
	loop: true
}});
var bassGroup = new Pz.Sound({ source: 'file', options: {
	path: './audio/bass-group.mp3',
	loop: true
}});
var drumsGroup = new Pz.Sound({ source: 'file', options: {
	path: './audio/drums-group.mp3',
	loop: true
}});

var group = new Pz.Group([guitarGroup, drumsGroup, bassGroup]);

var segments = [
	{
		audio: sineWave,
		playButton: document.getElementById('play-wave'),
		stopButton: document.getElementById('stop-wave'),
		volumeSlider: document.getElementById('volume-wave')
	},
	{
		audio: acoustic,
		playButton: document.getElementById('play-acoustic'),
		stopButton: document.getElementById('stop-acoustic'),
		volumeSlider: document.getElementById('volume-acoustic')
	},
	{
		audio: voice,
		playButton: document.getElementById('play-voice'),
		stopButton: document.getElementById('stop-voice'),
		volumeSlider: document.getElementById('volume-voice')
	},
	{
		audio: whiteNoise,
		playButton: document.getElementById('play-white'),
		stopButton: document.getElementById('stop-white'),
		volumeSlider: document.getElementById('volume-white')
	},
	{
		audio: sineWaveRelease,
		playButton: document.getElementById('play-release'),
		stopButton: document.getElementById('stop-release'),
		volumeSlider: document.getElementById('volume-release'),
		releaseSlider: document.getElementById('value-release'),
		attackSlider: document.getElementById('value-attack')
	},
	{
		audio: group,
		playButton: document.getElementById('play-group-1'),
		stopButton: document.getElementById('stop-group-1'),
		volumeSlider: document.getElementById('volume-group-1')
	},
	{
		audio: timba,
		playButton: document.getElementById('play-timba'),
		stopButton: document.getElementById('stop-timba'),
		volumeSlider: document.getElementById('volume-timba'),
		effects: [
			{
				instance: delay,
				parameters: {
					feedback: document.getElementById('delay-feedback'),
					time: document.getElementById('delay-time'),
					mix: document.getElementById('delay-mix')
				}
			}
		]
	},
	{
		audio: wah,
		playButton: document.getElementById('play-wah'),
		stopButton: document.getElementById('stop-wah'),
		volumeSlider: document.getElementById('volume-wah'),
		effects: [
			{
				instance: pingPongDelay,
				parameters: {
					feedback: document.getElementById('ping-pong-delay-feedback'),
					time: document.getElementById('ping-pong-delay-time'),
					mix: document.getElementById('ping-pong-delay-mix')
				}
			}
		]
	},
	{
		audio: chop,
		playButton: document.getElementById('play-chop'),
		stopButton: document.getElementById('stop-chop'),
		volumeSlider: document.getElementById('volume-chop'),
		effects: [
			{
				instance: dubDelay,
				parameters: {
					feedback: document.getElementById('dub-delay-feedback'),
					time: document.getElementById('dub-delay-time'),
					mix: document.getElementById('dub-delay-mix'),
					cutoff: document.getElementById('dub-delay-cutoff')
				}
			}
		]
	},
	{
		audio: stanceBass,
		playButton: document.getElementById('play-stance-bass'),
		stopButton: document.getElementById('stop-stance-bass'),
		volumeSlider: document.getElementById('volume-stance-bass'),
		effects: [
			{
				instance: stereoPanner,
				parameters: {
					pan: document.getElementById('stereo-panner-pan')
				}
			}
		]
	},
	{
		audio: cavaquinho,
		playButton: document.getElementById('play-cavaquinho'),
		stopButton: document.getElementById('stop-cavaquinho'),
		volumeSlider: document.getElementById('volume-cavaquinho'),
		effects: [
			{
				instance: reverb,
				parameters: {
					time: document.getElementById('reverb-time'),
					decay: document.getElementById('reverb-decay'),
					mix: document.getElementById('reverb-mix')
				}
			}
		]
	},
	{
		audio: drums,
		playButton: document.getElementById('play-drums'),
		stopButton: document.getElementById('stop-drums'),
		volumeSlider: document.getElementById('volume-drums'),
		effects: [
			{
				instance: convolver,
				parameters: {
					mix: document.getElementById('convolver-mix')
				}
			}
		]
	},

	{
		audio: tremoloGuitar,
		playButton: document.getElementById('play-tremolo-guitar'),
		stopButton: document.getElementById('stop-tremolo-guitar'),
		volumeSlider: document.getElementById('volume-tremolo-guitar'),
		effects: [
			{
				instance: tremolo,
				parameters: {
					speed: document.getElementById('tremolo-speed'),
					mix: document.getElementById('tremolo-mix'),
					depth: document.getElementById('tremolo-depth')
				}
			}
		]
	},

	{
		audio: electro,
		playButton: document.getElementById('play-electro'),
		stopButton: document.getElementById('stop-electro'),
		volumeSlider: document.getElementById('volume-electro'),
		effects: [
			{
				instance: compressor,
				parameters: {
					threshold: document.getElementById('compressor-threshold'),
					knee: document.getElementById('compressor-knee'),
					attack: document.getElementById('compressor-attack'),
					release: document.getElementById('compressor-release'),
					ratio: document.getElementById('compressor-ratio')
				}
			}
		]
	},
	{
		audio: synth,
		playButton: document.getElementById('play-synth'),
		stopButton: document.getElementById('stop-synth'),
		volumeSlider: document.getElementById('volume-synth'),
		effects: [
			{
				instance: lowPassFilter,
				parameters: {
					frequency: document.getElementById('low-pass-filter-frequency'),
					peak: document.getElementById('low-pass-filter-peak')
				}
			}
		]
	},
	{
		audio: synth2,
		playButton: document.getElementById('play-synth2'),
		stopButton: document.getElementById('stop-synth2'),
		volumeSlider: document.getElementById('volume-synth2'),
		effects: [
			{
				instance: highPassFilter,
				parameters: {
					frequency: document.getElementById('high-pass-filter-frequency'),
					peak: document.getElementById('high-pass-filter-peak')
				}
			}
		]
	},
	{
		audio: guitar,
		playButton: document.getElementById('play-guitar'),
		stopButton: document.getElementById('stop-guitar'),
		volumeSlider: document.getElementById('volume-guitar'),
		effects: [
			{
				instance: distortion,
				parameters: {
					gain: document.getElementById('distortion-gain')
				}
			}
		]
	},
	{
		audio: walkGuitar,
		playButton: document.getElementById('play-drum-fill'),
		stopButton: document.getElementById('stop-drum-fill'),
		volumeSlider: document.getElementById('volume-drum-fill'),
		effects: [
			{
				instance: quadrafuzz,
				parameters: {
					lowGain: document.getElementById('quadrafuzz-low'),
					midLowGain: document.getElementById('quadrafuzz-mid-low'),
					midHighGain: document.getElementById('quadrafuzz-mid-high'),
					highGain: document.getElementById('quadrafuzz-high'),
				}
			}
		]
	},
	{
		audio: electricGuitar,
		playButton: document.getElementById('play-electric-guitar'),
		stopButton: document.getElementById('stop-electric-guitar'),
		volumeSlider: document.getElementById('volume-electric-guitar'),
		effects: [
			{
				instance: flanger,
				parameters: {
					time: document.getElementById('flanger-time'),
					depth: document.getElementById('flanger-depth'),
					speed: document.getElementById('flanger-speed'),
					mix: document.getElementById('flanger-mix'),
					feedback: document.getElementById('flanger-feedback')
				}
			}
		]
	},
	{
		audio: countdown,
		playButton: document.getElementById('play-recorded-voice'),
		stopButton: document.getElementById('stop-recorded-voice'),
		volumeSlider: document.getElementById('volume-recorded-voice'),
		effects: [
			{
				instance: ringModulator,
				parameters: {
					speed: document.getElementById('ringmod-speed'),
					mix: document.getElementById('ringmod-mix'),
					distortion: document.getElementById('ringmod-distortion')
					}
				}
		]
	}
]

for (var i = 0; i < segments.length; i++) {
	(function(segment) {

		segment.audio.on('play', function() {
			segment.playButton.classList.add('pause');
		});

		segment.audio.on('stop', function() {
			segment.playButton.classList.remove('pause');
		});

		segment.audio.on('pause', function() {
			segment.playButton.classList.remove('pause');
		});

		segment.playButton.addEventListener('click', function(e) {
			if (segment.playButton.classList.contains('pause'))
				segment.audio.pause();
			else
				segment.audio.play();
		});

		segment.stopButton.addEventListener('click', function(e) {
			segment.audio.stop();
		});

		segment.volumeSlider.addEventListener('input', function(e) {
			var volumeDisplay = segment.volumeSlider.parentNode.getElementsByClassName('slider-value')[0];
			volumeDisplay.innerHTML = segment.audio.volume = e.target.valueAsNumber;
		});

		if (segment.releaseSlider) {
			segment.releaseSlider.addEventListener('input', function(e) {
				var releaseDisplay = segment.releaseSlider.parentNode.getElementsByClassName('slider-value')[0];
				releaseDisplay.innerHTML = segment.audio.release = e.target.valueAsNumber;
			});
		}

		if (segment.attackSlider) {
			segment.attackSlider.addEventListener('input', function(e) {
				var attackDisplay = segment.attackSlider.parentNode.getElementsByClassName('slider-value')[0];
				attackDisplay.innerHTML = segment.audio.attack = e.target.valueAsNumber;
			});
		}

		if (!segment.effects || !segment.effects.length)
			return;

		for (var i = 0; i < segment.effects.length; i++) {
			var effect = segment.effects[i];

			for (var key in effect.parameters) {
				(function(key, slider, instance){

					var display = slider.parentNode.getElementsByClassName('slider-value')[0];

					slider.addEventListener('input', function(e) {
						display.innerHTML = instance[key] = e.target.valueAsNumber;
					});

				})(key, effect.parameters[key], effect.instance);	
			}
		}

	})(segments[i]);
}