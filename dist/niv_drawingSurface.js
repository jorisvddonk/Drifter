/*
This file contains modified Noctis IV / Noctis IV Plus / Noctis IV CE source code,
and is therefore licensed under the WTOF PUBLIC LICENSE

For more information, visit:
http://anywherebb.com/wpl/wtof_public_license.html

See also 'General conditions for distribution of modified versions of Noctis IV's source code':
http://anynowhere.com/bb/posts.php?t=409&p=5

*/

///For drawing:
function convTerrain() {
  terrain = {
    width: TERRAIN_WIDTH,
    height: TERRAIN_HEIGHT,
    array: p_surfacemap
  };
}

function getTerrain(x, y, hideerrors) {
  return p_surfacemap[y * TERRAIN_HEIGHT + x];
}

function displayTerrain() {
  var geom = new THREE.Geometry();
  for (var y = 0; y < terrain.height; y++) {
    for (var x = 0; x < terrain.width; x++) {
      var vert = new THREE.Vector3(
        x * TERRAINMULT_X,
        y * TERRAINMULT_Y,
        getTerrain(x, y) * TERRAINMULT_Z
      );
      geom.vertices.push(vert);
    }
  }

  //tri1
  for (var y = 0; y < terrain.height - 1; y++) {
    for (var x = 0; x < terrain.width - 1; x++) {
      var face = new THREE.Face3(
        getVertexIndex(x + 0, y + 0),
        getVertexIndex(x + 1, y + 0),
        getVertexIndex(x + 0, y + 1)
      );
      geom.faces.push(face);
    }
  }
  //tri2
  for (var y = 1; y < terrain.height; y++) {
    for (var x = 0; x < terrain.width - 1; x++) {
      var face = new THREE.Face3(
        getVertexIndex(x + 0, y + 0),
        getVertexIndex(x + 1, y - 1),
        getVertexIndex(x + 1, y + 0)
      );
      geom.faces.push(face);
    }
  }
  geom.rotateX(1.5708 * 3);
  geom.translate(-1000, -500, 1000);
  geom.scale(0.2, 0.2, 0.2);
  geom.computeFaceNormals();
  geom.computeVertexNormals();

  //Generate UVs:
  for (var i = 0; i < geom.faces.length; i++) {
    geom.faceVertexUvs[0].push([
      new THREE.Vector2(0, 1),
      new THREE.Vector2(1, 1),
      new THREE.Vector2(1, 0),
      new THREE.Vector2(0, 0)
    ]);
  }
  return geom;
}

function getVertexIndex(x, y) {
  return y * terrain.width + x;
}
