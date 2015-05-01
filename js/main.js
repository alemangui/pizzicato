var sawtoothWave = new Pizzicato.Sound({ 
    wave: { type: 'sawtooth' }
});
var click = new Pizzicato.Sound('./audio/click.wav');
var birds = new Pizzicato.Sound('./audio/bird.wav', function() {
	var delay = new Pizzicato.Effects.Delay({
    repetitions: 6,
    time: 0.4,
    mix: 0.5
	});

	birds.addEffect(delay);
});
var dreamSound = new Pizzicato.Sound('./audio/dream.wav');
var beats = new Pizzicato.Sound('./audio/bird.wav', function() {
	var compressor = new Pizzicato.Effects.Compressor({
    threshold: -24,
    ratio: 12
	});

	beats.addEffect(compressor);
});

var segments = [
	{
		audio: sawtoothWave,
		playButton: document.getElementById('playWave'),
		stopButton: document.getElementById('stopWave')
	},
	{
		audio: click,
		playButton: document.getElementById('playClick'),
		stopButton: document.getElementById('stopClick')
	},
	{
		audio: birds,
		playButton: document.getElementById('playBirds'),
		stopButton: document.getElementById('stopBirds')
	},
	{
		audio: beats,
		playButton: document.getElementById('playBeats'),
		stopButton: document.getElementById('stopBeats')
	}
]

for (var i = 0; i < segments.length; i++) {
	(function(segment) {

		segment.audio.on('play', function() {
			segment.playButton.classList.add('pause');
		})
		segment.audio.on('stop', function() {
			segment.playButton.classList.remove('pause');
		});
		segment.audio.on('pause', function() {
			segment.playButton.classList.add('pause');
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

	})(segments[i]);
}