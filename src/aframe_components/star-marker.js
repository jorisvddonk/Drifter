AFRAME.registerComponent('star-marker', {
  init: function() {
    this.el.sceneEl.systems['noctis'].onStarSelected(selectedstar => {
      this.el.object3D.position.x = selectedstar.vector_scaled.x;
      this.el.object3D.position.y = selectedstar.vector_scaled.y;
      this.el.object3D.position.z = selectedstar.vector_scaled.z;
    });
  }
});
