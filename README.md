# Drifter - a space exploration experiment

Drifter is a space exploration experiment, based on Noctis IV, made with a-frame.

http://drifter.sarvva.moos.es/

See also:

* [Video of Drifter's starmap in VR](https://youtu.be/0MSrKIqAq9Q)
* [Video of Drifter's surface renderer in VR](https://youtu.be/vBojEvKK4pU)

## Running Drifter locally

First, you need to install all dependencies with `npm install`. Following that, run `npm run-script dev` and then visit http://localhost:8080/

## VR support

Drifter has support for the Oculus Rift on [WebVR supported browsers](https://webvr.info/).

Oculus Touch controls:

* Stick on left Touch controller: Move around.
* Y / B: Switch tools in left and right hand. On the planet surface, you can view various textures, a rendering of the planet from space, and a heightmap of the planet surface. On the Stardrifter, you can open up the star selection tool (left hand) and show various details of the selected star (right hand), including GUIDE notes.
* A: Switch beteween Stardrifter and planet surface.
* X: Refresh the page, to visit a new planet.

## A note on Noctis IV source code ported to JavaScript

Drifter contains Noctis IV source code, which was manually ported by myself (with help from the Noctis community) from C and Intel 16-bit Assembly to JavaScript. To make the porting process as easy as possible, the ported code is a near line-by-line translation from C to JavaScript. Noctis IV was written in such a way that variables were reused wherever possible, to limit memory usage. The translated source code behaves in a similar way, and introduces many variables to the global scope. Though it's not pretty, it mostly works. Unfortunately, the ported JavaScript code is not 100% compatible with Noctis IV's random terrain and planet generation, due to difficult to reproduce behaviour of the original code, and due to its incompleteness; not all original functionality has been ported over yet.
