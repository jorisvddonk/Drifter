AFRAME.registerComponent('remove-hand-controls', {
  init: function() {},
  tick: function(time) {
    // remove default hand model
    var obj3d = this.el.getObject3D('mesh');
    if (obj3d) {
      this.el.removeObject3D('mesh');
      this.el.removeAttribute('remove-hand-controls'); // once default hand model is removed; remove this component
    }
  }
});
