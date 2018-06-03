AFRAME.registerComponent('translate-with-grip', {
  schema: {
    elementsToTranslate: { type: 'string' }
  },
  init: function() {
    this.translating = false;
    this.lastPosition = null;
    this.el.addEventListener('gripchanged', e => {
      if (e.detail.value > 0.2) {
        this.translating = true;
      } else {
        this.translating = false;
        this.lastPosition = null;
      }
    });
  },
  tick: function() {
    if (this.translating) {
      var translate = this.el.object3D.position.clone();
      if (this.lastPosition) {
        translate.sub(this.lastPosition);
        var toTranslate = document.querySelectorAll(
          this.data.elementsToTranslate
        );
        toTranslate.forEach(function(elem) {
          elem.object3D.position.x += translate.x;
          elem.object3D.position.y += translate.y;
          elem.object3D.position.z += translate.z;
        });
      }
      this.lastPosition = this.el.object3D.position.clone();
    }
  }
});
