<img align="center" src="http://www.alemangui.com/index/img/work/pizzicato_horizontal.gif" alt="Pizzicato.js">

[![Build Status](https://travis-ci.org/alemangui/pizzicato.svg?branch=master)](https://travis-ci.org/alemangui/pizzicato)

##A Web Audio API wrapper in the making!

Pizzicato is still in its early stages. In the meantime, feel free to check out the project and take a look at the [website](http://alemangui.github.io/pizzicato/).

First install dependencies with 
```
npm install
```

And then run tests and build with
```
npm run test
```

Or to skip tests:
```
npm run build
```

## TL;DR: How does it work?
Include Pizzicato in your site
```html
<script src="./Pizzicato.js"></script>
```

Create a sound
```javascript
var sawtoothWave = new Pizzicato.Sound({ 
    wave: { type: 'sawtooth' }
});
```

Add effects
```javascript
var delay = new Pizzicato.Effects.Delay();
sawtoothWave.addEffect(delay);
```

Use it!
```javascript
sawtoothWave.play();
```

## Create a sound
To create a new sound, use the ```Pizzicato.Sound``` constructor, which takes an ```options``` argument and a callback that will be executed when the sound is ready to be used. If an error occurs, the callback will be called with the error as a parameter.
```javascript
var sound = new Pizzicato.Sound(Object options, [Function callback]);
```
For example:
```javascript
var click = new Pizzicato.Sound({ source: './sounds/click.wav' }, function(error) {
    if (!error)
        console.log('Sound ready to use!');
});
```
Sounds can be created from a variety of sources.
### Sounds from a waveform
To create a sound from an oscillator with a certain waveform, include the object ```wave``` in the constructor options. 

The ```wave``` object contains a ```type``` parameter for the type of waveform (```sine```, ```square```, ```sawtooth``` or ```triangle```) as well as a ```frequency``` parameter to indicate the frequency of the wave (e.g., 440 for an A note).
```javascript.
var sound = new Pizzicato.Sound({ 
    wave: { 
        type: 'sawtooth',
        frequency: 440
    }
});
```
### Sounds from a file
In order to load a sound from a file, include the ```source``` in the constructor options. You can also simply pass a string to the constructor with the path of the sound file.
```javascript
var sound = new Pizzicato.Sound({ source: './audio/sound.wav' });
// is equivalent to:
var sound = new Pizzicato.Sound('./audio/sound.wav');
```
### Sounds from the microphone
It is also possible to use the sound input from the computer. This is usually the microphone, but it could also be a line-in. To use this, initialize a Pizzicato Sound with the ```microphone``` option set to ```true```.
```javascript
var voice = new Pizzicato.Sound({ microphone: true });
```

## Add effects
Once a sound is created you can add effects to it by using the ```addEffect``` function. To remove an effect, you can use the ```removeEffect``` function.
```javascript
var delay = new Pizzicato.Effects.Delay();
sound.addEffect(delay);
sound.removeEffect(delay);
```
### Delay
The delay effect plays back the sound a certain number of times in defined intervals, giving the impression of an echo. The following options are available when creating a delay effect:
* ```feedback``` _(min: 0, max: 1, defaults to 0.5)_: The intensity with which the input will echo back. A larger value will result in more echo repetitions.
* ```time``` _(min: 0, max: 180, defaults to 0.3)_: Interval time in seconds.
* ```mix``` _(min: 0, max: 1, defaults to 0.5)_: Volume balance between the original audio and the effected output (the delayed sound).

Example:
```javascript
var delay = new Pizzicato.Effects.Delay({
    feedback: 0.8,
    time: 0.22,
    mix: 0.75
});
sound.addEffect(delay);
sound.play();
```

### Distortion
The distortion effect adds an "override" to the sound, similar to the ones found in guitar amps. The distortion effect only takes one parameter:
* ```gain``` _(min: 0, max: 1, defaults to 0.5)_: Amount of distortion applied.

Example:
```javascript
var distortion = new Pizzicato.Effects.Delay({
    gain: 0.4
});
sound.addEffect(delay);
sound.play();
```

### Compressor
A compressor allows reducing the range between the loudest and the quietest parts of a sound. This is done by boosting the quiet segments and attenuating the loud ones.

The following options are available when creating a compressor effect:
* ```threshold``` _(min: -100, max: 0, defaults to -24)_ The decibel value above which the compression will start taking effect.
* ```knee``` _(min: 0, max: 40, defaults to 30)_ A value representing the range above the threshold where the curve smoothly transitions to the "ratio" portion.
* ```attack``` _(min: 0, max: 1, defaults to 0.003)_ How soon the compressor starts to compress the dynamics after the threshold is exceeded. Short values will result in a fast response to sudden, loud sounds, but will make the changes in volume more obvious to listeners.
* ```release``` _(min: 0, max: 1, defaults to 0.025)_ How soon the compressor starts to release the volume level back to normal after the level drops below the threshold. 
* ```ratio``` _(min: 1, max: 20, defaults to 12)_  The amount of compression applied to the audio once it passes the threshold level. The higher the Ratio the more the loud parts of the audio will be compressed.

Example:
```javascript
var compressor = new Pizzicato.Effects.Delay({
    threshold: -20,
    knee: 22,
    attack: 0.05,
    release: 0.05,
    ratio: 18
});
sound.addEffect(compressor);
sound.play();
```

### Low pass filter
A low-pass filter passes signals with a frequency lower than a pre-determined cutoff frequency and attenuates signals with frequencies higher than the cutoff frequency. 

* ```frequency``` _(min: 10, max: 22050, defaults to 350)_: The cutoff frequency of the lowpass filter.
* ```peak``` _(min: 0.0001, max: 1000, defaults to 1)_: Indicates how peaked the frequency is around the cutoff frequency. The greater the value is, the greater is the peak.

Example:
```javascript
var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
    frequency: 400,
    peak: 10
});

sound.addEffect(lowPassFilter);
sound.play();
```

### Support
#### Browsers
Pizzicato can only work in [browsers with Web Audio support](http://caniuse.com/#feat=audio-api), no shims have been added yet. This means:
* Firefox 31+
* Chrome 31+
* Safari 7+ (microphone audio input not available in Safari)
* Opera 30+

#### Audio formats
Pizzicato supports [supported by Web Audio](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats#Browser_compatibility). These may vary depending on your system version and browser.