AFRAME.registerComponent('planetsurfacegridmaker', {
  init: function() {
    // Generate planet surface by generating a bunch of entity elements that each cover a small section of the planet geometry
    // Splitting a planet surface up into multiple geometries speeds up things like collision detection massively.
    var gridelements = 10; //the actual number of grid elements generated is this number, squared
    var gridsize = terrain.width / gridelements;
    for (var y = 0; y < gridelements; y++) {
      for (var x = 0; x < gridelements; x++) {
        var xmin = x * gridsize;
        var xmax = xmin + gridsize;
        var ymin = y * gridsize;
        var ymax = ymin + gridsize;
        var newElem = document.createElement('a-entity');
        newElem.setAttribute('geometry', 'primitive', 'planetsurface');
        newElem.setAttribute('geometry', 'xmin', xmin);
        newElem.setAttribute('geometry', 'xmax', xmax);
        newElem.setAttribute('geometry', 'ymin', ymin);
        newElem.setAttribute('geometry', 'ymax', ymax);
        newElem.setAttribute('texture-material', 'src', 'txtr');
        this.el.appendChild(newElem);
      }
    }
  }
});
