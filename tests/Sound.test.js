describe('Sound', function() {

	describe('initialization', function() {

		it('should create by default a sinewave sound with 440 frequency', function() {
			var sound = new Pizzicato.Sound();

			expect(toString.call(sound.getSourceNode())).toBe('[object OscillatorNode]');
			expect(sound.getSourceNode().frequency.value).toBe(440);
			expect(sound.getSourceNode().type).toBe('sine');
		});

		it('should throw an error if an invalid description is used', function() {
			expect(function() { var sound = new Pizzicato.Sound(42); }).toThrow();
		});

		it('should not have accessible initializers', function() {
			var sound = new Pizzicato.Sound();

			expect(sound.initializeWithUrl).toBe(undefined);
			expect(sound.initializeWithWave).toBe(undefined);
			expect(sound.initializeWithInput).toBe(undefined);
			expect(sound.initializeWithFunction).toBe(undefined);
		});

		describe('wave source', function() {

			it('should create an oscillator node', function() {
				var sound = new Pizzicato.Sound({ source: 'wave' });
				expect(toString.call(sound.getSourceNode())).toBe('[object OscillatorNode]');
			});

			it('should execute callback function', function(done) {
				var sound = new Pizzicato.Sound({ source: 'wave' }, function() {
					done();
				});
			}, 5000);

		});

		describe('script source', function() {

			it('should create a script processor when initialized with a script source', function() {
				var sound = new Pizzicato.Sound({ 
					source: 'script', 
					options: { 
						audioFunction: function(e) {} }
					}
				);
				sound.play();
				expect(sound.sourceNode.toString()).toContain('ScriptProcessorNode');
				sound.stop();
			});

			it('should create a script processor when initialized with a function', function() {
				var sound = new Pizzicato.Sound(function(e) {});
				sound.play();
				expect(sound.sourceNode.toString()).toContain('ScriptProcessorNode');
				sound.stop();
			});

		});

		describe('file source', function() {

			it('should create an audio buffer node when initialized with a file source', function(done) {
				var sound = new Pizzicato.Sound('base/tests/bird.wav', function(error) {
					expect(error).toBe(undefined);
					done();
				});
			}, 5000);

			it('should execute callback function when initializing file sound', function(done) {
				var sound = new Pizzicato.Sound('base/tests/bird.wav', function(error) {
					expect(error).toBe(undefined);
					done();
				});
			}, 5000);

			it('should take a fallback path in case a file is not found', function(done) {
				var sound = new Pizzicato.Sound({ 
					source: 'file',
					options: { path: ['base/tests/non-existent.wav', 'base/tests/bird.wav'] }
				}, function(error) {
					expect(error).toBe(undefined);
					done();
				});
			});

			it('should take a fallback path in case a file is not supported', function(done) {
				var sound = new Pizzicato.Sound({ 
					source: 'file',
					options: { path: ['base/tests/ddplus-format.mp4', 'base/tests/bird.wav'] }
				}, function(error) {
					expect(error).toBe(undefined);
					done();
				});
			});
		});

		describe('input source', function() {

			it('should get the audio input when initialized with an input source', function() {
				spyOn(navigator, 'mozGetUserMedia');
				var sound = new Pizzicato.Sound({ source: 'input' });
				expect(navigator.mozGetUserMedia).toHaveBeenCalled();
			});
			
		});
	});

	describe('volume', function() {

		it('should default to 1', function() {
			var sound = new Pizzicato.Sound();
			expect(sound.masterVolume.gain.value).toBeCloseTo(1.0);
		});

		it('should be overridable from the initialization', function() {
			var sound = new Pizzicato.Sound({
				source: 'wave',
				options: { volume: 0.8 }
			});
			expect(sound.masterVolume.gain.value).toBeCloseTo(0.8);
		});

		it('should be set only if it is a valid value', function() {
			var sound = new Pizzicato.Sound();
			expect(sound.masterVolume.gain.value).toBeCloseTo(1.0);
			sound.volume = 50;
			expect(sound.masterVolume.gain.value).toBeCloseTo(1.0);
		});

		it('change the master volume when editing the volume property', function() {
			var sound = new Pizzicato.Sound({ source: 'wave' });
			sound.volume = 0.3;
			expect(sound.masterVolume.gain.value).toBeCloseTo(0.3);
		});
	});

	describe('analyser', function() {

		it('should lazy load upon request', function() {
			var sound = new Pizzicato.Sound();

			expect(sound.analyser).toBe(undefined);

			var analyser = sound.getAnalyser();
			
			expect(sound.analyser).toBe(analyser);
			expect(analyser.toString()).toContain('object AnalyserNode');
		});
	});

	describe('actions', function() {

		it('should change the oscillator frequency when modifying the frequency in a wave based sound', function() {
			var sound = new Pizzicato.Sound({
				source: 'wave',
				options: { frequency: 440 }
			});
			expect(sound.frequency).toBe(440);

			sound.frequency = 300
			expect(sound.frequency).toBe(300);
		});

		it('pausing, playing and stopping should update the corresponding properties', function(done) {
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

		it('should trigger \'play\' when played', function() {
			var playCallback = jasmine.createSpy('playCallback');

			var sound = new Pizzicato.Sound();

			sound.on('play', playCallback);
			sound.play();
			sound.stop();
			expect(playCallback).toHaveBeenCalled();
		});

		it('should trigger \'pause\' when paused', function() {
			var pauseCallback = jasmine.createSpy('pauseCallback');

			var sound = new Pizzicato.Sound();

			sound.on('pause', pauseCallback);
			sound.play();
			sound.pause();
			expect(pauseCallback).toHaveBeenCalled();
		});

		it('should trigger \'stop\' when stopped', function() {
			var stopCallback = jasmine.createSpy('stopCallback');

			var sound = new Pizzicato.Sound();

			sound.on('stop', stopCallback);
			sound.play();
			sound.stop();
			expect(stopCallback).toHaveBeenCalled();
		});

		it('should trigger \'end\' when ended', function(done) {
			var endCallback = jasmine.createSpy('endCallback');

			var sound = new Pizzicato.Sound('base/tests/click.wav', function() {
				
				sound.on('end', endCallback);
				sound.play();

				setTimeout(function() {
					expect(endCallback).toHaveBeenCalled();
					done();
				}, 1000);
			});
		}, 10000);

		it('should offset upon playing when specified', function(done) {
			var endCallback = jasmine.createSpy('endCallback');
			var clipDuration = 4;
			var offset = 3;

			var sound = new Pizzicato.Sound('base/tests/bird.wav', function() {
				
				sound.on('end', endCallback);
				sound.play(0, offset);

				setTimeout(function() {
					expect(endCallback).toHaveBeenCalled();
					done();
				}, 2000);
			});
		}, 8000);

		it('should wait before playing when specified', function(done) {
			var endCallback = jasmine.createSpy('endCallback');
			var clipDuration = 4;
			var when = 2;

			var sound = new Pizzicato.Sound('base/tests/bird.wav', function() {
				
				sound.on('end', endCallback);
				sound.play(when, 0);

				setTimeout(function() {
					expect(endCallback).not.toHaveBeenCalled();
					done();
				}, 5000);
			});
		}, 8000);

		it('Pausing or stopping should have no effect when no source node is available', function() {
			var callback = jasmine.createSpy('endCallback');		
			var sound = new Pizzicato.Sound();
			
			sound.on('pause', callback);
			sound.on('stop', callback);

			sound.pause();
			sound.stop();

			expect(callback).not.toHaveBeenCalled();
		});

		it('should stop automatically when file sound is over', function(done) {
			var click = new Pizzicato.Sound('base/tests/click.wav', function() {
				click.play();

				setTimeout(function() {
					expect(click.playing).toBe(false);
					expect(click.paused).toBe(false);
					done();
				}, 1000);
			});
		}, 2000);

		it('should return a new sound object when cloning', function() {
			var sound = new Pizzicato.Sound();
			var clone = sound.clone();

			expect(sound).not.toBe(clone);
		});

		it('should return a sound with the same parameters when cloning', function() {
			var sound = new Pizzicato.Sound();
			sound.frequency = 220;
			sound.loop = true;

			var clone = sound.clone();

			expect(sound.frequency).toBe(clone.frequency);
			expect(sound.loop).toBe(clone.loop);
		});

		it('should return a sound with the same effects when cloning', function() {
			var sound = new Pizzicato.Sound();
			var delay = new Pizzicato.Effects.Delay();
			sound.addEffect(delay);

			var clone = sound.clone();

			expect(clone.effects[0]).toBe(delay);
		});
	});

	describe('effects', function() {
		it('should be added and removed', function(done) {
			var sound = new Pizzicato.Sound('base/tests/bird.wav', function() {
				var delay = new Pizzicato.Effects.Delay();
				
				sound.addEffect(delay);
				expect(sound.effects.indexOf(delay)).not.toBe(-1);

				sound.removeEffect(delay);
				expect(sound.effects.indexOf(delay)).toBe(-1);

				done();
			});
		}, 5000);

		it('should continue playing when effects are added', function(done) {
			var endCallback = jasmine.createSpy('endCallback');

			var sound = new Pizzicato.Sound('base/tests/click.wav', function() {

				var delay = new Pz.Effects.Delay();

				sound.play();
				sound.addEffect(delay);
				expect(sound.playing).toBe(true);

				setTimeout(function() {
					expect(endCallback).toHaveBeenCalled();
					done();
				}, 2000);
			});
			
			sound.on('end', endCallback);

		}, 5500);

		it('should continue playing when effects are removed', function(done) {
			var endCallback = jasmine.createSpy('endCallback');
			var delay = new Pz.Effects.Delay();

			var sound = new Pizzicato.Sound('base/tests/click.wav', function() {

				sound.play();
				sound.removeEffect(delay);

				expect(sound.playing).toBe(true);
				
				setTimeout(function() {
					expect(endCallback).toHaveBeenCalled();
					done();
				}, 2000);
			});

			sound.on('end', endCallback);
			sound.addEffect(delay);

		}, 5500);
	});
});