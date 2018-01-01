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
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}
function getTerrain(x,y, hideerrors) {
	return p_surfacemap[y*TERRAIN_HEIGHT+x];
}

function displayTerrain() {
    geom = new THREE.Geometry();
    for (var y = 0; y < terrain.height; y++) {
        for (var x = 0; x < terrain.width; x++) {
            var vert = new THREE.Vector3(x*TERRAINMULT_X,y*TERRAINMULT_Y,getTerrain(x,y)*TERRAINMULT_Z);
            geom.vertices.push(vert);
        }
    }
    
    //tri1
    for (var y = 0; y < terrain.height-1; y++) {
        for (var x = 0; x < terrain.width-1; x++) {
            var face = new THREE.Face3(getVertexIndex(x+0,y+0),getVertexIndex(x+1,y+0),getVertexIndex(x+0,y+1))
            geom.faces.push(face);
        }
    }
    //tri2
    for (var y = 1; y < terrain.height; y++) {
        for (var x = 0; x < terrain.width-1; x++) {
        	var face = new THREE.Face3(getVertexIndex(x+0,y+0),getVertexIndex(x+1,y-1),getVertexIndex(x+1,y+0));
            geom.faces.push(face);
        }
    }
    geom.computeFaceNormals();
    geom.computeVertexNormals();
    geom.rotateX(1.5708*3);
    geom.translate(-500, -400, 500);

    //Generate UVs:
    for (var i = 0; i < geom.faces.length; i++) {
		geom.faceVertexUvs[0].push([
        new THREE.Vector2(0,1),
        new THREE.Vector2(1,1),
        new THREE.Vector2(1,0),
        new THREE.Vector2(0,0)
    ]);
    }
    return geom;
}

function getVertexIndex(x,y) {
    return (y*terrain.width)+x;
}

function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

//#########################################

//ThreeJS:            
var scene, camera, geom, geomobj, renderer, controls, clock;            
function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    //geomobj.rotation.z += 0.01;
    controls.update( clock.getDelta() );
    renderer.render( scene, camera );
}

function init() {
	clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 60, 1000 / 600, 1, 10000 );
    camera.position.z = 1000;

    controls = new THREE.FirstPersonControls( camera );
	controls.movementSpeed = 100;
	controls.lookSpeed = 0.05;
	controls.lookVertical = true;
	controls.constrainVertical = true;
	controls.verticalMin = 1.1;
	controls.verticalMax = 2.2;

    scene.add( camera );

    geom.computeFaceNormals();

    //Generate THREEJS DataTexture from txtr array
	THREE_texture = generateNIVDataTexture(256,256);

    
    //var geommat = new THREE.MeshLambertMaterial({color: 0x33ff33});
    //var geommat = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
    var geommat = new THREE.MeshLambertMaterial({map: THREE_texture});
    var geommesh = new THREE.Mesh( geom, geommat );

    geommesh.position.x = -terrain.width*5;
    geommesh.position.y = -terrain.height*5;
    geommesh.doubleSided = true;
    
    geomobj = new THREE.Object3D();
    geomobj.scale.x = 1;
    geomobj.scale.y = 1;
    geomobj.scale.z = 1;
    geomobj.add(geommesh);
    geomobj.rotation.x = Math.PI * -0.5;
    geomobj.castShadow=false;
    geomobj.receiveShadow=true;
    geommesh.receiveShadow = true;
    geommesh.castShadow=true;
    scene.add(geomobj);

    var light =
        new THREE.SpotLight();
    light.position.x = -1200;
    light.position.y = 1200;
    light.position.z = 100;
    light.castShadow=true;
    light.intensity = 3;
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( 1000, 600 );
    
    //Shadows:
    renderer.shadowMapEnabled = true;
    renderer.setClearColorHex(0x000000, 1.0);
    
    //Set camera pos
    //camera.position.x = -1205.0428505657167
    //camera.position.y = 612.2415939635009
	//camera.position.z = 38.32690712525067
	camera.position.x = 0;				
	camera.position.y = terrain.array[terrain.width*(terrain.width*0.5)+(terrain.height*0.5)]*TERRAINMULT_Z + 1;
	camera.position.z = 0;

    $("#threeJScontent").append( renderer.domElement );
}


// Generates a DataTexture from a the txtr texture buffer
function generateNIVDataTexture ( width, height) {

	var size = width * height;
	var data = new Uint8Array( 3 * size );

	var tx = 0;
	var ty = 0;

	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			data[ (y*width+x) * 3 ] 	  = txtr[y*256+x] + 20;
			data[ (y*width+x) * 3 + 1 ] = txtr[y*256+x] + 20;
			data[ (y*width+x) * 3 + 2 ] = txtr[y*256+x] + 20;
		}
	}

	var texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat );
	texture.needsUpdate = true;

	return texture;
}