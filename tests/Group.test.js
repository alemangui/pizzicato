describe('Group', function() {

	describe('initialization', function() {

		it('should accept an array of sounds in the constructor', function() {
			var sound1 = new Pz.Sound();
			var sound2 = new Pz.Sound();
			var sound3 = new Pz.Sound();

			var group = new Pz.Group([sound1, sound2, sound3]);
			expect(group.sounds.length).toBe(3);
			expect(group.sounds[0]).toBe(sound1);
			expect(group.sounds[1]).toBe(sound2);
			expect(group.sounds[2]).toBe(sound3);
		});

		it('should carry on without any sounds specified', function() {
			var group = new Pz.Group();
			expect(group.sounds.length).toBe(0);
		});

	});


	describe('sounds', function() {

		it('should raise a warning if a detached sound is added', function() {
			spyOn(console, 'warn');
			
			var sound = new Pz.Sound({ source: 'wave', options: { detached: true } });
			var group = new Pz.Group();

			group.addSound(sound);

			expect(console.warn).toHaveBeenCalled();
		});

		it('should raise a warning if the sound is already in the group', function() {
			spyOn(console, 'warn');
			
			var sound = new Pz.Sound();
			var group = new Pz.Group();

			group.addSound(sound);
			group.addSound(sound);

			expect(console.warn).toHaveBeenCalled();
		});

		it('should raise an error if the object added is not a Pz.Sound object', function(){
			spyOn(console, 'error');
			
			var notSound = {};
			var group = new Pz.Group();

			group.addSound(notSound);

			expect(console.error).toHaveBeenCalled();
		});

		it('should play, stop and pause when group does so', function() {
			var sound1 = new Pz.Sound();
			var sound2 = new Pz.Sound();
			var sound3 = new Pz.Sound();

			var sounds = [sound1, sound2, sound3];
			var group = new Pz.Group(sounds);

			group.play();

			for (var i = 0; i < sounds.length; i++)
				expect(sounds[i].playing).toBe(true);
			
			group.pause();

			for (i = 0; i < sounds.length; i++)
				expect(sounds[i].paused).toBe(true);

			group.stop();

			for (i = 0; i < sounds.length; i++) {
				expect(sounds[i].playing).toBe(false);
				expect(sounds[i].paused).toBe(false);
			}
		});
	});


	describe('effects', function() {

		it('can be added and removed', function() {
			var delay = new Pizzicato.Effects.Delay();
			var pingPongDelay = new Pizzicato.Effects.PingPongDelay();
			var group = new Pizzicato.Group();
					
			group.addEffect(delay);
			expect(group.effects.indexOf(delay)).not.toBe(-1);

			group.addEffect(pingPongDelay);
			expect(group.effects.indexOf(pingPongDelay)).not.toBe(-1);

			group.removeEffect(pingPongDelay);
			expect(group.effects.indexOf(pingPongDelay)).toBe(-1);
			expect(group.effects.indexOf(delay)).not.toBe(-1);

			group.removeEffect(delay);
			expect(group.effects.indexOf(delay)).toBe(-1);
		});
	});

});