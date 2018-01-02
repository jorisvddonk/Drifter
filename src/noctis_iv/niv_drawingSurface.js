///For drawing:
function convTerrain() {
  terrain = {
    width: TERRAIN_WIDTH,
    height: TERRAIN_HEIGHT,
    array: p_surfacemap
  };
}

function setPixel(imageData, x, y, r, g, b, a) {
  index = (x + y * imageData.width) * 4;
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}
function getTerrain(x, y, hideerrors) {
  return p_surfacemap[y * TERRAIN_HEIGHT + x];
}

function displayTerrain() {
  geom = new THREE.Geometry();
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
  geom.computeFaceNormals();
  geom.computeVertexNormals();
  geom.rotateX(1.5708 * 3);
  geom.translate(-1000, -500, 1000);

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

function setPixel(imageData, x, y, r, g, b, a) {
  index = (x + y * imageData.width) * 4;
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}
