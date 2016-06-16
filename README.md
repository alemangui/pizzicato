<img align="center" src="https://alemangui.github.io/pizzicato/img/horizontal-logo.svg" alt="Pizzicato.js">

[![Build Status](https://travis-ci.org/alemangui/pizzicato.svg?branch=master)](https://travis-ci.org/alemangui/pizzicato)

##A Web Audio library

Pizzicato aims to simplify the way you create and manipulate sounds via the Web Audio API. Take a look at the [demo site here](https://alemangui.github.io/pizzicato/).

You can use bower to get Pizzicato
```
bower install pizzicato
```

Or checkout the project, install dependencies with 
```
npm install
```

And then run tests and build with
```
gulp test
```

Or to build without tests:
```
gulp scripts
```

## TL;DR: How does it work?
Include Pizzicato in your site
```html
<script src="./Pizzicato.js"></script>
```

Create a sound
```javascript
var sawtoothWave = new Pizzicato.Sound({ 
    source: 'wave',
    options {
        type: 'sawtooth'
    }
});
```

Add effects
```javascript
var delay = new Pizzicato.Effects.Delay();
sawtoothWave.addEffect(delay);
```

Play it!
```javascript
sawtoothWave.play();
```

## Table of contents
- [Create a sound](#create-a-sound)
  - [Sounds from a wave](#sounds-from-a-wave)
  - [Sounds from a file](#sounds-from-a-file)
  - [Sounds from input](#sounds-from-input)
  - [Sounds from a function](#sounds-from-a-function)
- [Effects](#effects)
  - [Delay](#delay)
  - [PingPongDelay](#pingpongdelay)
  - [Distortion](#distortion)
  - [Flanger](#flanger)
  - [Compressor](#compressor)
  - [Low-pass filter](#low-pass-filter)
  - [High-pass filter](#high-pass-filter)
  - [Stereo Panner](#stereo-panner)
  - [Convolver](#convolver)
- [Advanced](#advanced)
  - [Accessing the audio context](#accessing-the-context)
  - [Getting an analyser node for a sound](#analyser-node)
  - [General volume](#general-volume)
- [Support](#support)
  - [Browsers](#browsers)
  - [Audio formats](#audio-formats)

<a name="create-a-sound"/>
## Create a sound
To create a new sound, use the ```Pizzicato.Sound``` constructor, which takes an object with the sound's ```description``` as argument and a callback that will be executed when the sound is ready to be used. If an error occurs, the callback will be called with the error as a parameter.
```javascript
var sound = new Pizzicato.Sound(Object description, [Function callback]);
```
For example:
```javascript
var click = new Pizzicato.Sound({ source: 'wave' }, function(error) {
    if (!error)
        console.log('Sound ready to use!');
});
```

Typically, the ```description``` object contains a string ```source``` and an object ```options```.

For example, this objects describes a sine waveform with a frequency of 440:
```javascript
{
    source: 'wave',
    options: {
        type: 'sine',
        frequency: 440
    }
}
```

Sounds can be created from a variety of sources.

<a name="sounds-from-a-wave"/>
### Sounds from a wave
To create a sound from an oscillator with a certain waveform, use the ```source: wave``` in your description. Additionally, the following optional parameters are possible inside the ```options``` object:
* ```type``` _(Optional; ```sine```, ```square```, ```triangle``` or ```sawtooth```, defaults to ```sine```)_: Specifies the type of waveform.
* ```frequency``` _(Optional; defaults to 440)_: Indicates the frequency of the wave (i.e., a 440 value will yield an A note).
* ```volume``` _(Optional; min: 0, max: 1, defaults to 1)_: Loudness of the sound.
* ```sustain``` _(Optional; defaults to 0.4)_: Value in seconds that indicates the fade-out time when the sound is stopped.
* ```attack``` _(Optional; defaults to 0.4)_: Value in seconds that indicates the fade-in time when the sound is played.

```javascript
var sound = new Pizzicato.Sound({ 
        source: 'wave',
        options: { type: 'sawtooth', frequency: 440 }
});
```

Creating a Pizzicato Sound with an empty constructor will create a sound with a sine wave and a frequency of 440.

```javascript
var sound = new Pizzicato.Sound();
```

<a name="sounds-from-a-file"/>
### Sounds from a file
In order to load a sound from a file, include the ```source: file``` in your description. Additionally, the following  parameters are possible inside the ```options``` object:
* ```path``` _(Mandatory; string or array of strings)_: Specifies the path of the sound file. It is also possible to have an array of paths to fallback on. Pizzicato will attempt to load the paths in order, passing on to the next one in case of failure.
* ```loop``` _(Optional; boolean, defaults to false)_: If set, the file will start playing again after the end.
* ```volume``` _(Optional; min: 0, max: 1, defaults to 1)_: Loudness of the sound.
* ```sustain``` _(Optional; defaults to 0)_: Value in seconds that indicates the fade-out time once the sound is stopped.
* ```attack``` _(Optional; defaults to 0.4)_: Value in seconds that indicates the fade-in time when the sound is played.

```javascript
var sound = new Pizzicato.Sound({ 
    source: 'file',
    options: { path: './audio/sound.wav' }
}, function() {
    console.log('sound file loaded!');
});
```
It is possible to pass several paths to fallback in case of error:
```javascript
var sound = new Pizzicato.Sound({ 
    source: 'file',
    options: { path: ['./audio/sound-special-format.wav', './audio/sound.wav'] }
}, function() {
    console.log('sound file loaded!');
});
```

Alternatively, you can also simply pass a string to the constructor with the path of the sound file.
```
var sound = new Pizzicato.Sound('./audio/sound.wav', function() {...});
```
Check the [supported audio files](#audio-formats) that can be played with Pizzicato.

<a name="sounds-from-input"/>
### Sounds from the user input
It is also possible to use the sound input from the computer. This is usually the microphone, but it could also be a line-in input. To use this, add ```source: input``` in your description. The following optional parameters are possible inside ```options``` object:
* ```volume``` _(Optional; min: 0, max: 1, defaults to 1)_: Loudness of the sound.
* ```sustain``` _(Optional; defaults to 0)_: Value in seconds that indicates the fade-out time once the sound is stopped.
* ```attack``` _(Optional; defaults to 0.4)_: Value in seconds that indicates the fade-in time when the sound is played.

```javascript
var voice = new Pizzicato.Sound({
    source: 'input',
    options: { volume: 0.8 }
});
```

<a name="sounds-from-a-function"/>
### Sounds from a function
For more creative freedom, Pizzicato also allows direct audio processing. Sounds can be created from a Javascript function by including ```source: script``` in the description. The following parameters are possible in the ```options``` object:
* ```audioFunction``` _(Mandatory; function(<audio processing event>))_: Function that will be called with the audio processing event.
* ```bufferSize``` _(Optional; number - must be a power of 2.)_: This value controls how many sample frames will be processed at each audio process event. Lower values will result in lower latency, higher values help prevent glitches.
* ```volume``` _(Optional; min: 0, max: 1, defaults to 1)_: Loudness of the sound.
* ```sustain``` _(Optional; defaults to 0)_: Value in seconds that indicates the fade-out time once the sound is stopped.
* ```attack``` _(Optional; defaults to 0.4)_: Value in seconds that indicates the fade-in time when the sound is played.

For example:
```javascript
var whiteNoise = Pizzicato.Sound({
    source: 'script',
    options: {
        audioFunction: function(e) {
            var output = e.outputBuffer.getChannelData(0);
            for (var i = 0; i < e.outputBuffer.length; i++)
                output[i] = Math.random();
        }
    }
});
```

<a name="effects"/>
## Effects
Once a sound is created you can add effects to it by using the ```addEffect``` function. To remove an effect, you can use the ```removeEffect``` function.
```javascript
var delay = new Pizzicato.Effects.Delay();
sound.addEffect(delay);
sound.removeEffect(delay);
```

<a name="delay"/>
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

<a name="pingpongdelay"/>
### PingPongDelay
This is the same as the delay effect, however on each feedback loop the output is swapped between left and right channels. The following options are available when creating a delay effect:
* ```feedback``` _(min: 0, max: 1, defaults to 0.5)_: The intensity with which the input will echo back. A larger value will result in more echo repetitions.
* ```time``` _(min: 0, max: 180, defaults to 0.3)_: Interval time in seconds.
* ```mix``` _(min: 0, max: 1, defaults to 0.5)_: Volume balance between the original audio and the effected output (the delayed sound).

Example:
```javascript
var pingpongdelay = new Pizzicato.Effects.PingPongDelay({
    feedback: 0.3,
    time: 0.2,
    mix: 0.68
});
sound.addEffect(pingpongdelay);
sound.play();
```

<a name="distortion"/>
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

<a name="flanger"/>
### Flanger
The flanger produces a swirling effect by delaying a "copy" of the sound by a small, gradually changing period. The flanger effect takes the folloeing parameters:
* ```time``` _(min: 0, max: 1, defaults to 0.45)_: Changes the small delay time applied to the copied signal.
* ```speed``` _(min: 0, max: 1, defaults to 0.2)_: Changes the speed at which the flanging occurs.
* ```depth``` _(min: 0, max: 1, defaults to 0.1)_: Changes the depth/intensity of the swirling effect.
* ```feedback``` _(min: 0, max: 1, defaults to 0.1)_: Changes the volume of the delayed sound.
* ```mix``` _(min: 0, max: 1, defaults to 0.5)_: Volume balance between the original audio and the effected output.

Example:
```javascript
var flanger = new Pizzicato.Effects.Flanger({
    time: 0.45,
    speed: 0.2,
    depth: 0.1,
    feedback: 0.1,
    mix: 0.5
});

sound.addEffect(flanger);
sound.play();
```

<a name="compressor"/>
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

<a name="low-pass-filter"/>
### Low-pass filter
A low-pass filter passes signals with a frequency lower than a pre-determined cutoff frequency and attenuates signals with frequencies higher than the cutoff frequency. 

* ```frequency``` _(min: 10, max: 22050, defaults to 350)_: The cutoff frequency of the low-pass filter.
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

<a name="high-pass-filter"/>
### High-pass filter
A high-pass filter is the opposite of a low-pass filter (described above). It attenuates signals with a frequency lower than a pre-determined cutoff frequency and passes signals with frequencies higher than the cutoff frequency. 

* ```frequency``` _(min: 10, max: 22050, defaults to 350)_: The cutoff frequency of the high-pass filter.
* ```peak``` _(min: 0.0001, max: 1000, defaults to 1)_: Indicates how peaked the frequency is around the cutoff frequency. The greater the value is, the greater is the peak.

Example:
```javascript
var highPassFilter = new Pizzicato.Effects.HighPassFilter({
    frequency: 120,
    peak: 10
});

sound.addEffect(highPassFilter);
sound.play();
```

<a name="stereo-panner"/>
### Stereo panner
The stereo panner is used to pan an audio stream left or right.

* ```pan``` _(min: -1, max: 1, defaults to 0)_: Pan value between -1 (full left pan) and 1 (full right pan).

Example:
```javascript
var stereoPanner = new Pizzicato.Effects.StereoPanner({
    pan: 0.5
});

sound.addEffect(stereoPanner);
sound.play();
```

<a name="convolver"/>
### Convolver
The convolver can be used to load in an impulse file, often for a reverb effect

* ```impulse``` _(Mandatory; string)_: path to your impulse file.

Example:
```javascript
var convolver = new Pizzicato.Effects.convolver({
    impulse: './path/to/your/impulse.wav',
    mix: 0.5
});

sound.addEffect(convolver);
sound.play();
```

<a name="advanced">
## Advanced

<a name="accessing-the-context">
### Accessing the audio context
If needed, the audio context used by Pizzicato is always accessible:
```javascript
var context = Pizzicato.context;
```

<a name="analyser-node">
### Getting an analyser node for a sound object
You can obtain an analyser node for a particular Pizzicato Sound object by using the function ```getAnalyser```:
```javascript
var sound = new Pizzicato.Sound();
var analyser = sound.getAnalyser();
```

<a name="general-volume">
### General volume
In order to change the general volume of all Pizzicato sounds, you can directly modify the property ```volume```:
```javascript
Pizzicato.volume = 0.3;
```

<a name="support"/>
## Support

<a name="browsers"/>
### Browsers
Pizzicato can only work in [browsers with Web Audio support](http://caniuse.com/#feat=audio-api), no shims have been added yet. This means:
* Firefox 31+
* Chrome 31+
* Safari 7+ (input source not available in Safari)
* Opera 30+
* Edge 13+

<a name="audio-formats"/>
### Audio formats
Pizzicato supports audio formats [supported by your browser](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats#Browser_compatibility). These may vary depending on your system version and browser.
