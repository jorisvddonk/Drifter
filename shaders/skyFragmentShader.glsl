uniform vec3 sunColor;
uniform vec3 sunPosition;
uniform float sunscattering;
uniform float atmosphericDensity;
varying vec3 vWorldPosition;

float sunEffect(vec3 pointOnSphere, vec3 starpos, float scatter, float discsize) {
    float angle = acos(dot(pointOnSphere, normalize(starpos)));
    if (angle <= discsize) {
        return 1.0;
    } else {
        if (scatter == 0.0) {
            return 0.0;
        } else {
            float norm_angle = (angle * (1.0 / scatter));
            norm_angle = norm_angle * 10.0;
            float retval = 1.0 - norm_angle;
            if (retval < 0.0) {
                retval = 0.0;
            }
            retval = pow(abs(retval), 25.0);
            
            return max(0.0, min(1.0, retval));
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
    vec4 color_initial = vec4(0.0, 0.0, 0.0, 1.0);
    float sunnyness = sunEffect(pointOnSphere, sunPosition, sunscattering, 0.03);
    float starriness = 0.0;
    if (atmosphericDensity < 60.0) {
        for (int i = 0; i < 500; i++) {
            starriness = starriness + getStar(pointOnSphere, i);
        }
    }
    vec3 sunComponent = vec3(sunColor.r * sunnyness, sunColor.g * sunnyness, sunColor.b * sunnyness);
    gl_FragColor = vec4(color_initial.r + starriness + sunComponent.r, color_initial.g + starriness + sunComponent.g, color_initial.b + starriness + sunComponent.b, color_initial.a);
}