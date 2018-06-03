AFRAME.registerComponent('no-fog', {
  init: function() {
    this.el.sceneEl.removeAttribute('fog');
  }
});
