/*
MIT License

Copyright (c) 2018 Joris van de Donk

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Debug functions:
// renderPlanetTexture(terrain.array, 200, 200, 2, false); // render planet heightmap
// renderPlanetTexture(ruinschart, 200, 200, 2, false); // render planet ruins chart (ruins on Felysian worlds, lava)
// renderPlanetTexture(txtr,256,256,2); // render surface texture
// renderPalette(); // render palette

require('./aframe_systems/noctis.js');
require('./aframe_components/ncc-model');
require('./aframe_components/remove-hand-controls');
require('./aframe_components/follow-camera');
require('./aframe_components/debug-show-always');
require('./aframe_components/3d-starmap');
require('./aframe_components/planet-sky');
require('./aframe_components/planet-fog');
require('./aframe_components/no-fog');
require('./aframe_components/planetsurface');
require('./aframe_components/planetsurfacegridmaker');
require('./aframe_components/texture-material');
require('./aframe_components/planet-space-material');
require('./aframe_components/hide');
require('./aframe_components/collider-check');
require('./aframe_components/global-controller-actions');
require('./aframe_components/face-camera');
require('./aframe_components/starmap-star-selector');
require('./aframe_components/translate-with-grip');
require('./aframe_components/show-guide-entries');
require('./aframe_components/star-marker');
require('./aframe_components/star-marker-text');
require('./aframe_components/star-selected-actions');

var RIGHT_HAND_TOOLS = ['none', 'map', 'texture_surface', 'texture_planet'];
var LEFT_HAND_TOOLS = ['none', 'planet'];
var SELECTED_LEFT_HAND_TOOL = 0;
var SELECTED_RIGHT_HAND_TOOL = 0;

AFRAME.registerComponent('hand-tool', {
  schema: {
    hand: { type: 'string', default: 'left' },
    name: { type: 'string', default: 'none' }
  },
  tick: function() {
    var visible = false;
    if (this.data.hand === 'left') {
      if (LEFT_HAND_TOOLS[SELECTED_LEFT_HAND_TOOL] === this.data.name) {
        visible = true;
      }
    }
    if (this.data.hand === 'right') {
      if (RIGHT_HAND_TOOLS[SELECTED_RIGHT_HAND_TOOL] === this.data.name) {
        visible = true;
      }
    }
    this.el.object3D.visible = visible;
  }
});

AFRAME.registerComponent('hand-controller-actions', {
  init: function() {
    this.el.addEventListener('ybuttondown', function(e) {
      SELECTED_LEFT_HAND_TOOL += 1;
      if (SELECTED_LEFT_HAND_TOOL > LEFT_HAND_TOOLS.length - 1) {
        SELECTED_LEFT_HAND_TOOL = 0;
      }
    });
    this.el.addEventListener('bbuttondown', function(e) {
      SELECTED_RIGHT_HAND_TOOL += 1;
      if (SELECTED_RIGHT_HAND_TOOL > RIGHT_HAND_TOOLS.length - 1) {
        SELECTED_RIGHT_HAND_TOOL = 0;
      }
    });
  }
});
