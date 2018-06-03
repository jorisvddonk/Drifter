AFRAME.registerComponent('show-star-details', {
  init: function() {
    this.el.sceneEl.systems['noctis'].onStarSelected(selectedstar => {
      setTimeout(() => {
        text = `${CURRENTSTAR.name}\nClass: S${
          CURRENTSTAR.type
        }\nNumber of planets: ${
          CURRENTSTAR.nop
        }\nNumber of moons: ${CURRENTSTAR.nob -
          CURRENTSTAR.nop}\nNumber of bodies: ${
          CURRENTSTAR.nob
        }\n\nRadius: ${CURRENTSTAR.ray.toFixed(
          3
        )} centidyams\n\nParsis coordinates:\n ${
          CURRENTSTAR.x
        }; ${-CURRENTSTAR.y}; ${CURRENTSTAR.z}`;
        this.el.setAttribute('text', 'value', text);
      }, 0);
    });
  }
});
