 #ifdef VECTOR_TILE
uniform vec4 u_highlightColor;
      #endif

in vec2 v_st;

void main() {
  czm_materialInput materialInput;

  vec2 st = v_st;
  st.t = czm_readNonPerspective(st.t, gl_FragCoord.w);

  materialInput.s = st.s;
  materialInput.st = st;
  materialInput.str = vec3(st, 0.0);
  czm_material material = czm_getMaterial(materialInput);
  vec3 color = light_color_1.rgb;
  float start = 0.;
  float end = .5;
  float t = fract(u_time_0 * .4) * (1. + end) - end;
  start += t;
  end += t;
  if(st.x > start && st.x < end) {
    float d = 1. - (st.x - start) / (end - start);
    color = mix(color, color * .6, d * d);
  } else {
    color = color * .6;
  }
  material.emission = color;
  out_FragColor = vec4(material.diffuse + material.emission, light_color_1.a);
      #ifdef VECTOR_TILE
  out_FragColor *= u_highlightColor;
      #endif

  czm_writeLogDepth();
}