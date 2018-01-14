Pizzicato.Group = function(sounds) {

	sounds = sounds || [];
	
	this.mergeGainNode = Pz.context.createGain();
	this.masterVolume = Pz.context.createGain();
	this.sounds = [];
	this.effects = [];
	this.effectConnectors = [];

	this.mergeGainNode.connect(this.masterVolume);
	this.masterVolume.connect(Pz.masterGainNode);

	for (var i = 0; i < sounds.length; i++)
		this.addSound(sounds[i]);
};

Pizzicato.Group.prototype = Object.create(Pz.Events, {

	connect: {
		enumerable: true,

		value: function(audioNode) {
			this.masterVolume.connect(audioNode);
			return this;
		}
	},


	disconnect: {
		enumerable: true,

		value: function(audioNode) {
			this.masterVolume.disconnect(audioNode);
			return this;
		}
	},


	addSound: {
		enumerable: true,

		value: function(sound) {
			if (!Pz.Util.isSound(sound)) {
				console.error('You can only add Pizzicato.Sound objects');
				return;
			}
			if (this.sounds.indexOf(sound) > -1) {
				console.warn('The Pizzicato.Sound object was already added to this group');
				return;
			}
			if (sound.detached) {
				console.warn('Groups do not support detached sounds. You can manually create an audio graph to group detached sounds together.');
				return;
			}

			sound.disconnect(Pz.masterGainNode);
			sound.connect(this.mergeGainNode);
			this.sounds.push(sound);
		}
	},


	removeSound: {
		enumerable: true,

		value: function(sound) {
			var index = this.sounds.indexOf(sound);

			if (index === -1) {
				console.warn('Cannot remove a sound that is not part of this group.');
				return;
			}

			sound.disconnect(this.mergeGainNode);
			sound.connect(Pz.masterGainNode);
			this.sounds.splice(index, 1);
		}
	},


	volume: {
		enumerable: true,

		get: function() {
			if (this.masterVolume)
				return this.masterVolume.gain.value;
		},

		set: function(volume) {
			if (Pz.Util.isInRange(volume, 0, 1))
				this.masterVolume.gain.value = volume;
		}
	},


	play: {
		enumerable: true,

		value: function() {
			for (var i = 0; i < this.sounds.length; i++)
				this.sounds[i].play();

			this.trigger('play');
		}

	},


	stop: {
		enumerable: true,

		value: function() {
			for (var i = 0; i < this.sounds.length; i++)
				this.sounds[i].stop();

			this.trigger('stop');
		}

	},


	pause: {
		enumerable: true,

		value: function() {
			for (var i = 0; i < this.sounds.length; i++)
				this.sounds[i].pause();

			this.trigger('pause');
		}

	},

	/**
	 * Similarly to Sound objects, adding effects will create a graph in which there will be a
	 * gain node (effectConnector) in between every effect added. For example:
	 * [fadeNode]--->[effect 1]->[connector 1]--->[effect 2]->[connector 2]--->[masterGain]
	 * 
	 * Connectors are used to know what nodes to disconnect and not disrupt the
	 * connections of another Pz.Group object using the same effect.
	 */
	addEffect: {
		enumerable: true,

		value: function(effect) {
			if (!Pz.Util.isEffect(effect)) {
				console.error('The object provided is not a Pizzicato effect.');
				return this;
			}

			this.effects.push(effect);

			// Connects effect in the last position
			var previousNode = this.effectConnectors.length > 0 ? this.effectConnectors[this.effectConnectors.length - 1] : this.mergeGainNode;
			previousNode.disconnect();
			previousNode.connect(effect);

			// Creates connector for the newly added effect
			var gain = Pz.context.createGain();
			this.effectConnectors.push(gain);
			effect.connect(gain);
			gain.connect(this.masterVolume);

			return this;
		}
	},

	/**
	 * When removing effects, the graph in which there will be a
	 * gain node (effectConnector) in between every effect should be 
	 * conserved. For example:
	 * [fadeNode]--->[effect 1]->[connector 1]--->[effect 2]->[connector 2]--->[masterGain]
	 * 
	 * Connectors are used to know what nodes to disconnect and not disrupt the
	 * connections of another Pz.Group object using the same effect.
	 */
	removeEffect: {
		enumerable: true,

		value: function(effect) {
			var index = this.effects.indexOf(effect);

			if (index === -1) {
				console.warn('Cannot remove effect that is not applied to this group.');
				return this;
			}

			var previousNode = (index === 0) ? this.mergeGainNode : this.effectConnectors[index - 1];
			previousNode.disconnect();

			// Disconnect connector and effect
			var effectConnector = this.effectConnectors[index];
			effectConnector.disconnect();
			effect.disconnect(effectConnector);

			// Remove connector and effect from our arrays
			this.effectConnectors.splice(index, 1);
			this.effects.splice(index, 1);

			var targetNode; 
			if (index > this.effects.length - 1 || this.effects.length === 0)
				targetNode = this.masterVolume;
			else
				targetNode = this.effects[index];

			previousNode.connect(targetNode);

			return this;
		}
	}

});