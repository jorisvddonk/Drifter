require('aframe');
require('aframe-extras');
require('super-hands');
var GamepadControls = require('aframe-gamepad-controls');
AFRAME.registerComponent('gamepad-controls', GamepadControls);

require('./shaders/skyGradient.js');
require('./src/drifter-components.js');

var _ = require('lodash');

