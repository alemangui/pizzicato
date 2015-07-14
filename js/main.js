var delay = new Pizzicato.Effects.Delay({
  repetitions: 6,
  time: 0.4,
  mix: 0.5
});
var compressor = new Pizzicato.Effects.Compressor({
  threshold: -24,
  ratio: 12
});
var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
	frequency: 400,
	peak: 10
});
var distortion = new Pizzicato.Effects.Distortion({
	gain: 0.4
});
var flanger = new Pizzicato.Effects.Flanger();


var sawtoothWave 		= new Pizzicato.Sound({ wave: { type: 'sawtooth' }});
var acoustic 				= new Pizzicato.Sound('./audio/acoustic.m4a');
var timba 					= new Pizzicato.Sound({ source: './audio/timba.m4a', loop: true }, function() { timba.addEffect(delay); });
var electro 				= new Pizzicato.Sound({ source: './audio/electro.m4a', loop: true }, function() { electro.addEffect(compressor); });
var synth		 				= new Pizzicato.Sound({ source: './audio/synth.m4a', loop: true }, function() { synth.addEffect(lowPassFilter); });
var guitar 					= new Pizzicato.Sound({ source: './audio/guitar.m4a', loop: true }, function() { guitar.addEffect(distortion); });
var electricGuitar 	= new Pizzicato.Sound({ source: './audio/electric-guitar.m4a', loop: true }, function() { electricGuitar.addEffect(flanger); });
var whiteNoise    	= new Pizzicato.Sound(function(e) {
  var output = e.outputBuffer.getChannelData(0);
  for (var i = 0; i < e.outputBuffer.length; i++)
    output[i] = Math.random();
});
var voice 				= new Pizzicato.Sound({ microphone: true }, function(err) {
	if (!err) return;
	document.getElementById('playVoice').setAttribute('disabled', 'disabled');
	document.getElementById('stopVoice').setAttribute('disabled', 'disabled');
	document.getElementById('volume-voice').setAttribute('disabled', 'disabled');
	document.getElementById('microphone-error').style.display = 'block';
});

var segments = [
	{
		audio: sawtoothWave,
		playButton: document.getElementById('playWave'),
		stopButton: document.getElementById('stopWave'),
		volumeSlider: document.getElementById('volume-wave')
	},
	{
		audio: acoustic,
		playButton: document.getElementById('playAcoustic'),
		stopButton: document.getElementById('stopAcoustic'),
		volumeSlider: document.getElementById('volume-acoustic')
	},
	{
		audio: voice,
		playButton: document.getElementById('playVoice'),
		stopButton: document.getElementById('stopVoice'),
		volumeSlider: document.getElementById('volume-voice')
	},
	{
		audio: whiteNoise,
		playButton: document.getElementById('playWhite'),
		stopButton: document.getElementById('stopWhite'),
		volumeSlider: document.getElementById('volume-white')
	},
	{
		audio: timba,
		playButton: document.getElementById('playTimba'),
		stopButton: document.getElementById('stopTimba'),
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
		audio: electro,
		playButton: document.getElementById('playElectro'),
		stopButton: document.getElementById('stopElectro'),
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
		playButton: document.getElementById('playSynth'),
		stopButton: document.getElementById('stopSynth'),
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
		audio: guitar,
		playButton: document.getElementById('playGuitar'),
		stopButton: document.getElementById('stopGuitar'),
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
		audio: electricGuitar,
		playButton: document.getElementById('playElectricGuitar'),
		stopButton: document.getElementById('stopElectricGuitar'),
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