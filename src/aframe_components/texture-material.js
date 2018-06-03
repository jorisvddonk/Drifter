AFRAME.registerComponent('texture-material', {
  schema: {
    src: { type: 'string', default: 'txtr' },
    width: { type: 'number', default: 256 },
    height: { type: 'number', default: 256 },
    type: { type: 'string', default: 'surface' }
  },
  init: function() {
    var texture;
    if (this.data.type === 'surface') {
      texture = generateNIVDataTexture(
        this.data.width,
        this.data.height,
        eval(this.data.src)
      );
    } else if (this.data.type === 'space') {
      texture = generateNIVSpaceDataTexture(
        this.data.width,
        this.data.height,
        eval(this.data.src)
      );
    }
    var geommat = new THREE.MeshLambertMaterial({
      map: texture,
      opacity: 1
    });
    this.material = this.el.getOrCreateObject3D('mesh').material = geommat;
  }
});
