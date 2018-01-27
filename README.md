# Drifter - a space exploration experiment

Drifter is a space exploration experiment, based on Noctis IV, made with a-frame.

http://drifter.sarvva.moos.es/

## Running Drifter locally

First, you need to install all dependencies with `npm install`. Following that, run `npm run-script dev` and then visit http://localhost:8080/

## A note on Noctis IV source code ported to JavaScript

Drifter contains Noctis IV source code, which was manually ported by myself (with help from the Noctis community) from C and Intel 16-bit Assembly to JavaScript. To make the porting process as easy as possible, the ported code is a near line-by-line translation from C to JavaScript. Noctis IV was written in such a way that variables were reused wherever possible, to limit memory usage. The translated source code behaves in a similar way, and introduces many variables to the global scope. Though it's not pretty, it mostly works. Unfortunately, the ported JavaScript code is not 100% compatible with Noctis IV's random terrain and planet generation, due to difficult to reproduce behaviour of the original code, and due to its incompleteness; not all original functionality has been ported over yet.
