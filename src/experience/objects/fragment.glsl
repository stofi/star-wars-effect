varying vec2 vUv;

uniform sampler2D textureA;
uniform sampler2D textureB;
uniform float fade;



void main() {
  vec2 uv = vUv;

    vec4 colorA = vec4(1.0, 0.0, 0.0, 1.0);
    vec4 colorB = vec4(0.0,1.0,0.0,1.0);
    colorA = texture2D(textureA, uv);
    colorB = texture2D(textureB, uv);
    
    

    vec4 color = mix(colorA, colorB, fade);

    
    gl_FragColor = color;
    // gl_FragColor.rgb= vec3(fadeA, fadeB, fadeC);
}
