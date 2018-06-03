AFRAME.registerComponent('planet-sky', {
  init: function() {
    var atmosphericDensity =
      planet_typesAtmosphericDensity[
        this.el.sceneEl.systems.noctis.planet_type
      ];
    var sunscattering =
      planet_typesSunScattering[this.el.sceneEl.systems.noctis.planet_type];
    var r = this.el.sceneEl.systems.noctis.toHex(Math.min(255, nearstar_r * 4));
    var g = this.el.sceneEl.systems.noctis.toHex(Math.min(255, nearstar_g * 4));
    var b = this.el.sceneEl.systems.noctis.toHex(Math.min(255, nearstar_b * 4));
    var sunColor = this.el.sceneEl.systems.noctis.getSunColor();
    this.el.setAttribute('material', 'sunColor', sunColor);
    this.el.setAttribute('material', 'sunscattering', sunscattering);
    this.el.setAttribute('material', 'atmosphericDensity', atmosphericDensity);
  }
});
