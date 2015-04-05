describe('Sound', function() {

	it('should create an oscillator mode when initialized with a wave option', function() {
		var sound = new Pizzicato.Sound({
			wave: { type: 'sine' }
		});
		expect(toString.call(sound.getSourceNode())).toBe('[object OscillatorNode]')
	});

	it('should execute callback function when given one', function(done) {
		var sound = new Pizzicato.Sound('base/tests/bird.wav', function() {
			done();
		});
	}, 5000);

	it('volume should default to 1', function() {
		var sound = new Pizzicato.Sound({
			wave: { type: 'sine' }
		});
		expect(sound.volume).toBeCloseTo(1.0);
		expect(sound.getMasterVolumeNode().gain.value).toBeCloseTo(1.0);
	});

	it('volume should be overridable from the initialization', function() {
		var sound = new Pizzicato.Sound({
			wave: { type: 'sine' },
			volume: 0.8
		});
		expect(sound.volume).toBeCloseTo(0.8);
		expect(sound.getMasterVolumeNode().gain.value).toBeCloseTo(0.8);
	});

	it('Pausing, playing and stopping should update the corresponding properties', function(done) {
		var sound = new Pizzicato.Sound('base/tests/bird.wav', function() {
			expect(sound.playing).toBe(false);
			expect(sound.paused).toBe(false);

			sound.play();
			expect(sound.playing).toBe(true);
			expect(sound.paused).toBe(false);
			
			sound.pause();
			expect(sound.playing).toBe(false);
			expect(sound.paused).toBe(true);

			sound.play();
			expect(sound.playing).toBe(true);
			expect(sound.paused).toBe(false);

			sound.stop();
			expect(sound.playing).toBe(false);
			expect(sound.paused).toBe(false);

			done();
		});
	}, 5000);

	it('Should add and remove effects from its effect list', function(done) {
		var sound = new Pizzicato.Sound('base/tests/bird.wav', function() {
			var delay = new Pizzicato.Effects.Delay();
			
			sound.addEffect(delay);
			expect(sound.effects.indexOf(delay)).not.toBe(-1);

			sound.removeEffect(delay);
			expect(sound.effects.indexOf(delay)).toBe(-1);

			done();
		});
		}, 5000);
});