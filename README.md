# Drifter - a space exploration experiment

Drifter is a space exploration experiment, based on Noctis IV, made with [A-Frame](https://aframe.io/).

Currently, it consists of two parts:

* A [Noctis IV STARMAP viewer](https://youtu.be/0MSrKIqAq9Q), reminiscient of NoctisMapper, accessible from within the Stardrifter. Full functionality only works if you have VR controllers available (most likely, only the Touch controllers of the Oculus Rift work properly).
* A [simple planet exploration demo](https://youtu.be/vBojEvKK4pU), with planet terrains mimicing those of Noctis IV. Some of the original code has been ported to JavaScript for this to work.

http://drifter.sarvva.moos.es/

## System requirements

You'll need a recent desktop browser to be able to run this. I recommend the latest version of Google Chrome or Firefox, as those are the browsers that have been tested thoroughly. For VR support, you'll want to run Firefox or another [WebVR supported browser](https://webvr.info/).

You're also probably going to need some hardware acceleration.

Drifter has not been tested on smartphones.

## Running Drifter locally

First, you need to install all dependencies with `npm install`. Following that, run `npm run-script dev` and then visit http://localhost:8080/

## VR support

Oculus Touch controls:

* Stick on left Touch controller: Move around.
* Y / B: Switch tools in left and right hand. On the planet surface, you can view various textures, a rendering of the planet from space, and a heightmap of the planet surface. On the Stardrifter, you can open up the star selection tool (left hand) and show various details of the selected star (right hand), including GUIDE notes.
* A: Switch beteween Stardrifter and planet surface.
* X: Refresh the page, to visit a new planet.

## A note on Noctis IV source code ported to JavaScript

Drifter contains Noctis IV source code, which was manually ported by myself (with help from the Noctis community) from C and Intel 16-bit Assembly to JavaScript. To make the porting process as easy as possible, the ported code is a near line-by-line translation from C to JavaScript. Noctis IV was written in such a way that variables were reused wherever possible, to limit memory usage. The translated source code behaves in a similar way, and introduces many variables to the global scope. Though it's not pretty, it mostly works. Unfortunately, the ported JavaScript code is not 100% compatible with Noctis IV's random terrain and planet generation, due to difficult to reproduce behaviour of the original code, and due to its incompleteness; not all original functionality has been ported over yet.
