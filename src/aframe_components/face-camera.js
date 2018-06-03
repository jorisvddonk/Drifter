AFRAME.registerComponent('face-camera', {
  tick: function() {
    this.el.setAttribute(
      'rotation',
      this.el.sceneEl.camera.el.getAttribute('rotation')
    );
  }
});
