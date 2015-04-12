var click = new Pizzicato.Sound('./audio/click.wav', function() {
	console.log('click loaded');
});

var birds = new Pizzicato.Sound('./audio/bird.wav', function() {
	console.log('birds loaded');

	var delay = new Pizzicato.Effects.Delay({
    repetitions: 6,
    time: 0.4,
    mix: 0.5
	});

	birds.addEffect(delay);
});

var dreamSound = new Pizzicato.Sound('./audio/dream.wav', function() {
	console.log('dreamSound loaded');
});

var sawtoothWave = new Pizzicato.Sound({ 
    wave: { type: 'sawtooth' }
});


var waveButton = document.getElementById('playWave');
var clickButton = document.getElementById('playClick');
var delayButton = document.getElementById('playBirds');

waveButton.addEventListener('click', function() {
	sawtoothWave.play();
});

clickButton.addEventListener('click', function() {
	click.play();
});

delayButton.addEventListener('click', function() {
	birds.play();
});

