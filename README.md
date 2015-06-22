<img align="center" src="http://www.alemangui.com/index/img/work/pizzicato_horizontal.gif" alt="Pizzicato.js">

[![Build Status](https://travis-ci.org/alemangui/pizzicato.svg?branch=master)](https://travis-ci.org/alemangui/pizzicato)

##A Web Audio API wrapper in the making!

In the meantime, feel free to check out the project and take a look at the [website](http://alemangui.github.io/pizzicato/).

First install dependencies with 
```
npm install
```

And then run tests and build with
```
npm test
```

Or to skip tests:
```
npm build
```

## How does it work?
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