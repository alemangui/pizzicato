var delay = new Pizzicato.Effects.Delay({
  repetitions: 6,
  time: 0.4,
  mix: 0.5
});
var compressor = new Pizzicato.Effects.Compressor({
  threshold: -24,
  ratio: 12
});


var sawtoothWave 	= new Pizzicato.Sound({ wave: { type: 'sawtooth' }});
var click 				= new Pizzicato.Sound('./audio/click.wav');
var birds 				= new Pizzicato.Sound('./audio/bird.wav', function() { birds.addEffect(delay); });
var dreamSound 		= new Pizzicato.Sound('./audio/dream.wav');
var beats 				= new Pizzicato.Sound('./audio/bird.wav', function() { beats.addEffect(compressor); });
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
		audio: click,
		playButton: document.getElementById('playClick'),
		stopButton: document.getElementById('stopClick'),
		volumeSlider: document.getElementById('volume-click')
	},
	{
		audio: voice,
		playButton: document.getElementById('playVoice'),
		stopButton: document.getElementById('stopVoice'),
		volumeSlider: document.getElementById('volume-voice')
	},
	{
		audio: birds,
		playButton: document.getElementById('playBirds'),
		stopButton: document.getElementById('stopBirds'),
		volumeSlider: document.getElementById('volume-birds'),
		effects: [
			{
				instance: delay,
				parameters: {
					repetitions: document.getElementById('delay-repetitions'),
					time: document.getElementById('delay-time'),
					mix: document.getElementById('delay-mix')
				}
			}
		]
	},
	{
		audio: beats,
		playButton: document.getElementById('playBeats'),
		stopButton: document.getElementById('stopBeats'),
		volumeSlider: document.getElementById('volume-beats'),
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