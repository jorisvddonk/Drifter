// Noctis sources
require('file-loader?name=[name].[ext]!./src/noctis_iv/niv_globals.js');
require('file-loader?name=[name].[ext]!./src/noctis_iv/niv_starmap.js');
require('file-loader?name=[name].[ext]!./src/noctis_iv/niv_drawingSpace.js');
require('file-loader?name=[name].[ext]!./src/noctis_iv/niv_drawingSurface.js');
require('file-loader?name=[name].[ext]!./src/noctis_iv/niv_engine.js');
require('file-loader?name=[name].[ext]!./src/noctis_iv/niv_space.js');
require('file-loader?name=[name].[ext]!./src/noctis_iv/niv_rand.js');
require('file-loader?name=[name].[ext]!./src/noctis_iv/niv_textures.js');

// Other libs and files
require('aframe');
require('aframe-extras');
require('super-hands');
var GamepadControls = require('aframe-gamepad-controls');
AFRAME.registerComponent('gamepad-controls', GamepadControls);

require('./shaders/skyGradient.js');
require('./src/drifter-components.js');

var _ = require('lodash');

