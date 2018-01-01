var xinited = false;
var xinit = function() {
    if (!xinited) {
        xinited = true;
        //CURRENTSTAR = prepare_star(extract_target_info({x:-18928,y:-29680,z:-67336}));
        var randCoord = function() {
            return parseInt(Math.random() * 100000) - 50000;
        };

        CURRENTSTAR = prepare_star(extract_target_info({x:randCoord(),y:randCoord(),z:randCoord()}))
        nearstar_r = CURRENTSTAR['r'];
        nearstar_g = CURRENTSTAR['g'];
        nearstar_b = CURRENTSTAR['b'];

        c_srand(parseInt(Math.random()*256));
        console.log("Seed is: " + Seed);

        generatePalette(5); 
        //renderPalette();


        //create_craterized_world();
        create_thickatmosphere_world();
        //create_volcanic_world();
        //create_thinatmosphere_world();

        /*prepare_space();
        create_thinatmosphere_space();
        //create_icy_space();
        //create_quartz_space();
        //create_craterized_space();
        //create_volcanic_space();
        //create_largeinconsistent_space();
        //create_thickatmosphere_space();
        finish_space();*/
        
        convTerrain();
        //displaySphere();
        //renderPlanetTexture(p_background,360,180,2);
    }
}

AFRAME.registerGeometry('planetsurface', {
    init: function () {
        xinit();
        this.geometry = displayTerrain();
    }
});

var planMat = null;

AFRAME.registerComponent('planet-material', {
    init: function () {
        xinit();
        planMat = this;
    	THREE_texture = generateNIVDataTexture(256,256);
        var geommat = new THREE.MeshLambertMaterial({map: THREE_texture, opacity: 0.5});
        this.material = this.el.getOrCreateObject3D('mesh').material = geommat;
    }
});


AFRAME.registerComponent('collider-check', {
    dependencies: [],

    tick: function(time, timeDelta) {
            var pos = this.el.object3D.position;
            var raycaster = new THREE.Raycaster(pos, new THREE.Vector3(0,-1,0));
            var intersects = raycaster.intersectObject(planMat.el.object3D, true);
            if (intersects.length > 0) {
                var intersect = intersects.pop();
                if (intersect && intersect.distance > 0) {
                    if (time < 1) {
                        return;
                    }
                    var oldPos = this.el.getAttribute('position');
                    var newPos = {
                        x: oldPos.x,
                        y: oldPos.y,
                        z: oldPos.z,
                    }
                    newPos.y = intersect.point.y + 1;
                    this.el.setAttribute('position', newPos)
                }
            }
    },
  
    init: function () {}
  });