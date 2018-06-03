AFRAME.registerComponent('star-marker-text', {
  init: function() {
    this.el.sceneEl.systems['noctis'].onStarSelected(selectedstar => {
      this.el.setAttribute('text', 'value', selectedstar.name);
    });
  }
});
