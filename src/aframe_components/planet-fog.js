AFRAME.registerComponent('planet-fog', {
  init: function() {
    var skyColor = this.el.sceneEl.systems.noctis.getSkyHexColor();
    var atmosphericDensity =
      planet_typesAtmosphericDensity[
        this.el.sceneEl.systems.noctis.planet_type
      ];
    if (atmosphericDensity > 0) {
      this.el.sceneEl.setAttribute('fog', 'type', 'linear');
      this.el.sceneEl.setAttribute('fog', 'near', '1');
      this.el.sceneEl.setAttribute('fog', 'far', 300 - 2 * atmosphericDensity); // less on a thick atmosphere world
      this.el.sceneEl.setAttribute('fog', 'color', skyColor);
    }
  }
});
