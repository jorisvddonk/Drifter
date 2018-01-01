var TERRAINMULT_X = 10;
var TERRAINMULT_Y = 10;
var TERRAINMULT_Z = 2;


var MULTIPLIER = 0x015a4e35; //22695477
var INCREMENT = 1;
var RAND_MAX = 32767;
var Seed = 1;
var rand_count = 0;
var class_planets = [12, 18, 8, 15, 20, 3, 0, 1, 7, 20, 2, 5];
var star_classes = 12;
var planet_types = 10;
var maxbodies = 80;
var deg = Math.PI / 180;
var qt_M_PI = 4*Math.PI/3;
var class_ray = [5000, 15000, 300, 20000, 15000, 1000, 3000,
				2000, 4000, 1500, 30000, 250];
var planet_symbols = ["^", "d", "k", "f", "r", "n", "@", "i", "q", "+", "*"];
var planet_codes = ["unstable",
					"dusty, craterized", 
					"thick atmosphere", 
					"felisian", 
					"rocky, creased", 
					"thin atmosphere", 
					"large, not consistent", 
					"icy surface", 
					"quartz surface", 
					"substellar object", 
					"companion star"];

var class_rayvar = [2000, 10000, 200, 15000, 5000, 1000, 3000,
				   500, 5000, 10000, 1000, 10 ];

var class_rgb = [
	63, 58, 40,
	30, 50, 63,
	63, 63, 63,
	63, 30, 20,
	63, 55, 32,
	32, 16, 10,
	32, 28, 24,
	10, 20, 63,
	63, 32, 16,
	48, 32, 63,
	40, 10, 10,
	00, 63, 63
];

var planet_rgb_and_var = [ 60, 30, 15,      20,
				       40, 50, 40,	25,
				       32, 32, 32, 	32,
				       16, 32, 48,      40,
				       32, 40, 32,	20,
				       32, 32, 32,      32,
				       32, 32, 32,      32,
				       32, 40, 48,      24,
				       40, 40, 40,      30,
				       50, 25, 10,      20,
				       40, 40, 40,	40 ];

var planet_possiblemoons = [1, 1, 2, 3, 2, 2, 18, 2, 3, 20, 20 ];
var planet_orb_scaling=  5;
var avg_planet_sizing =  2.4;
var moon_orb_scaling  = 12.8;
var avg_moon_sizing   =  1.8;

var avg_planet_ray = [0.007, 0.003, 0.010, 0.011, 0.010, 0.008, 0.064, 0.009,
 						0.012, 0.125, 5.000];

 var planet_typesStr = ["INTERNALLY HOT",
				   "CRATERIZED NO ATMOSPHERE",
				   "THICK ATMOSPHERE",
				   "FELISIAN",
				   "CREASED NO ATMOSPHERE",
				   "THIN ATMOSPHERE",
				   "LARGE NOT CONSISTENT",
				   "ICY",
				   "QUARTZ",
				   "SUBSTELLAR OBJECT",
				   "COMPANION STAR"];

var M_PI = Math.PI;
var M_PI_2 = Math.PI * 0.5;

var TERRAIN_WIDTH = 200;
var TERRAIN_HEIGHT = 200;

var cos = Math.cos;
var sin = Math.sin;
var SQRT = Math.sqrt;
var pow = Math.pow;
var abs = Math.abs;
var intval = parseInt;

var p_background = [];
var objectschart = []; //for clouds and stuff. half the resolution of p_background.
var p_surfacemap = [];
var txtr = [];
var ruinschart = [];
var overlay = [];

//NOCTIS-D.h
var AF1 =    0x40;
var AF2 =    0x80;
var AF3 =    0xC0;
var AF4 =    0xF0;
var AF5 =    0xF1;
var AF6 =    0xF2;

//// temp todo
var raw_albedo = 5;
var albedo = 5;
var terrain;
var RAND_FACTOR = 0.8;
var secs = 1000000;
var nearstar_r = 1;
var nearstar_g = 1;
var nearstar_b = 1;
var colorbase = 0;

var lave;
var crays;
var a;
var kfract = 2;
var c, gr, r, g, b, Acr, Acx, Acy, px, py;

var palette = [];
var CURRENTSTAR;

function initArrays() {
	initArrays_surface();
	initArrays_space();
}

function initArrays_surface() {
	p_surfacemap = [];
	txtr = [];
	ruinschart = [];
	for (var y = 0; y < TERRAIN_HEIGHT; y++) {
		for (var x = 0; x < TERRAIN_WIDTH; x++) {
			p_surfacemap.push(1);
			ruinschart.push(1);
		}
	}
	for (var y = 0; y < 256; y++) {
		for (var x = 0; x < 256; x++) {
			txtr.push(16);
		}
	}
}

function initArrays_space() {
	p_background = [];
	objectschart = [];
	for (var y = 0; y < 360; y++) {
		for (var x = 0; x < 180; x++) {
			p_background.push(0);
		}
	}
	for (var y = 0; y < 360*0.5; y++) {
		for (var x = 0; x < 180*0.5; x++) {
			objectschart.push(0);
		}
	}
}
initArrays();