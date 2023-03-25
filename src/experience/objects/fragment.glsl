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
    float offset = 0.1;
    color += colorA * smoothstep(offset,1.-offset,fadeA);
    color += colorB * smoothstep(offset,1.-offset,fadeB);
    color += colorC * smoothstep(offset,1.-offset,fadeC);

    
    gl_FragColor = color;
    // gl_FragColor.rgb= vec3(fadeA, fadeB, fadeC);
}
