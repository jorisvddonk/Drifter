AFRAME.registerGeometry('planetsurface', {
  schema: {
    xmin: { default: 0, min: 0, max: 200, type: 'int' },
    xmax: { default: 199, min: 0, max: 200, type: 'int' },
    ymin: { default: 0, min: 0, max: 200, type: 'int' },
    ymax: { default: 199, min: 0, max: 200, type: 'int' }
  },
  init: function(data) {
    this.geometry = getTerrainGeometry(
      data.xmin,
      data.ymin,
      data.xmax,
      data.ymax
    );
  }
});
