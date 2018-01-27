/* global AFRAME */
/*
The MIT License

Copyright © 2015-2017 A-Frame authors & Joris van de Donk.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

AFRAME.registerShader('skyGradient', {
  schema: {
    colorTop: { type: 'color', default: 'black', is: 'uniform' },
    colorBottom: { type: 'color', default: 'red', is: 'uniform' },
    sunPosition: { type: 'vec3', default: '1 1 0', is: 'uniform' },
    sunscattering: { type: 'float', default: '0', is: 'uniform' },
    atmosphericDensity: { type: 'float', default: '0', is: 'uniform' }
  },

  vertexShader: `
   varying vec3 vWorldPosition;

   void main() {

     vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
     vWorldPosition = worldPosition.xyz;

     gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

   }

  `,

  fragmentShader: `
   uniform vec3 colorTop;
   uniform vec3 colorBottom;
   uniform vec3 sunPosition;
   uniform float sunscattering;
   uniform float atmosphericDensity;

   varying vec3 vWorldPosition;
   const vec3 sun = vec3(1.0, 1.0, 0.0);

   float sunEffect(vec3 pointOnSphere, vec3 starpos, float scatter, float discsize) {
     float angle = acos(dot(pointOnSphere, normalize(starpos)));
     if (angle <= discsize) {
       return 1.0;
     } else {
       if (scatter == 0.0) {
         return 0.0;
       } else {
         return max(0.0, min(1.0, 1.0 - ((angle / (scatter))*100.0)));
       }
     }
   }

   float getStar(vec3 pointOnSphere, int first) {
    float x = 0.5 - fract(sin(float(first))*100000.0);
    float y = fract(sin(float(first)+1.0)*100000.0) - 0.1;
    float z = 0.5 - fract(sin(float(first)+2.0)*100000.0);
    return sunEffect(pointOnSphere, vec3(x, y, z), 0.15, 0.0004);
   }

   void main()

   {
     vec3 pointOnSphere = normalize(vWorldPosition.xyz);
     float f = 1.0;
     f = sin((pointOnSphere.y+0.0) * 1.5);
     vec4 vertGradient = vec4(mix(colorBottom,colorTop, f ), 1.0);
     float sunnyness = sunEffect(pointOnSphere, sunPosition, sunscattering, 0.03);
     float starriness = 0.0;
     if (atmosphericDensity < 60.0) {
       for (int i = 0; i < 500; i++) {
         starriness = starriness + getStar(pointOnSphere, i);
       }
     }
     gl_FragColor = vec4(vertGradient.r + starriness + sunnyness, vertGradient.g + starriness + sunnyness, vertGradient.b + starriness + sunnyness, vertGradient.a);
   }`
});
