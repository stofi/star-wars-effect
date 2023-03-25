varying vec2 vUv;

uniform sampler2D textureA;
uniform sampler2D textureB;
uniform sampler2D textureC;
uniform float fadeA;
uniform float fadeB;
uniform float fadeC;



void main() {
  vec2 uv = vUv;

    vec4 colorA = vec4(1.0, 0.0, 0.0, 1.0);
    vec4 colorB = vec4(0.0,1.0,0.0,1.0);
    vec4 colorC = vec4(0.0,0.0,1.0,1.0);
    colorA = texture2D(textureA, uv);
    colorB = texture2D(textureB, uv);
    colorC = texture2D(textureC, uv);
    
    

    vec4 color = vec4(0.0);

    color += colorA * fadeA;
    color += colorB * fadeB;
    color += colorC * fadeC;

    
    gl_FragColor = color;
    // gl_FragColor.rgb= vec3(fadeA, fadeB, fadeC);
}
