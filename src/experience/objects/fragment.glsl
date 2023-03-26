varying vec2 vUv;

uniform sampler2D textureA;
uniform sampler2D textureB;
uniform float fadeA;
uniform float fadeB;



void main() {
  vec2 uv = vUv;

    vec4 colorA = vec4(1.0, 0.0, 0.0, 1.0);
    vec4 colorB = vec4(0.0,1.0,0.0,1.0);
    colorA = texture2D(textureA, uv);
    colorB = texture2D(textureB, uv);
    
    

    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    float o = 0.05;
    color += colorA * smoothstep(o, 1.0-o, fadeA);
    color += colorB * smoothstep(o, 1.0-o, fadeB);

    
    gl_FragColor = color;
    // gl_FragColor.rgb += vec3(fadeA, fadeB, 0.) /.1;
}
