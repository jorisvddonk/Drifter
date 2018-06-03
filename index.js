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
require('aframe-point-component');
require('aframe-template-component');

require('./shaders/sky.js');
require('./src/drifter-components.js');

var _ = require('lodash');

window.switchScene = function() {
  var sceneElem = document.getElementById('selectedScene');
  sceneElem.setAttribute(
    'template',
    'src',
    sceneElem.getAttribute('template').src === '#stardrifter'
      ? '#planet_surface'
      : '#stardrifter'
  );
};

window.searchStar = function(starname) {
  var noctis_system = document.getElementById('scene').systems['noctis'];
  noctis_system.selectedStar(noctis_system.getStarByName(starname));
};
