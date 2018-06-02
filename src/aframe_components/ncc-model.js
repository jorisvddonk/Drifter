AFRAME.registerComponent('ncc-model', {
  schema: {
    filename: { default: '', type: 'string' },
    scale: { default: 0.02, type: 'float' }
  },
  init: function() {
    fetch(this.data.filename)
      .then(function(res) {
        return res.arrayBuffer();
      })
      .then(buffer => {
        this.geometry = new THREE.Geometry();
        var dataView = new DataView(buffer);
        var offset = 0;
        var readUInt8 = function() {
          var retval = dataView.getUint8(offset, true);
          offset += 1;
          return retval;
        };
        var readUInt16 = function() {
          var retval = dataView.getUint16(offset, true);
          offset += 2;
          return retval;
        };
        var readFloat32 = function() {
          var retval = dataView.getFloat32(offset, true);
          offset += 4;
          return retval;
        };
        var num_polys = readUInt16();
        var num_vertices_per_poly = [];
        var xs = [];
        var ys = [];
        var zs = [];
        var colors = [];
        for (var i = 0; i < num_polys; i++) {
          num_vertices_per_poly.push(readUInt8());
        }
        for (var i = 0; i < num_polys * 4; i++) {
          xs.push(readFloat32());
        }
        for (var i = 0; i < num_polys * 4; i++) {
          ys.push(readFloat32());
        }
        for (var i = 0; i < num_polys * 4; i++) {
          zs.push(readFloat32());
        }
        for (var i = 0; i < num_polys; i++) {
          colors.push(readUInt8());
        }
        var pindex = 0;
        for (var i = 0; i < num_polys; i++) {
          for (var j = 0; j < num_vertices_per_poly[i]; j++) {
            this.geometry.vertices.push(
              new THREE.Vector3(xs[i * 4 + j], ys[i * 4 + j], zs[i * 4 + j])
            );
          }
          if (num_vertices_per_poly[i] == 3) {
            this.geometry.faces.push(
              new THREE.Face3(pindex + 0, pindex + 1, pindex + 2)
            );
          } else if (num_vertices_per_poly[i] == 4) {
            this.geometry.faces.push(
              new THREE.Face3(pindex + 0, pindex + 1, pindex + 2)
            );
            this.geometry.faces.push(
              new THREE.Face3(pindex + 0, pindex + 2, pindex + 3)
            );
          }
          pindex = pindex + num_vertices_per_poly[i];
        }
        var reduceMin = function(memo, val) {
          if (val < memo || memo === undefined) {
            return val;
          }
          return memo;
        };
        var reduceMax = function(memo, val) {
          if (val > memo || memo === undefined) {
            return val;
          }
          return memo;
        };
        var xVs = this.geometry.vertices.map(v => {
          return v.x;
        });
        var yVs = this.geometry.vertices.map(v => {
          return v.y;
        });
        var zVs = this.geometry.vertices.map(v => {
          return v.z;
        });
        var x_Min = xVs.reduce(reduceMin);
        var y_Min = yVs.reduce(reduceMin);
        var z_Min = zVs.reduce(reduceMin);
        var x_Max = xVs.reduce(reduceMax);
        var y_Max = yVs.reduce(reduceMax);
        var z_Max = zVs.reduce(reduceMax);

        this.geometry.translate(
          0 - (x_Min + (x_Max - x_Min) * 0.5),
          0 - (y_Min + (y_Max - y_Min) * 0.5),
          0 - (z_Min + (z_Max - z_Min) * 0.5)
        );

        this.geometry.scale(this.data.scale, this.data.scale, this.data.scale);
        this.geometry.rotateY(Math.PI * 0.5);
        this.geometry.rotateZ(Math.PI * 1);
        this.geometry.computeVertexNormals();
        this.geometry.computeFaceNormals();
        this.geometry.computeBoundingSphere();
        this.material = new THREE.MeshStandardMaterial({
          color: '#fff',
          side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.el.setObject3D('mesh', this.mesh);
      });
  }
});
