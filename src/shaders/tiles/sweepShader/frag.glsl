
/**

    struct FragmentInput {
    // Processed attribute values. See the Attributes Struct section below.
    Attributes attributes;
    // Feature IDs/Batch IDs. See the FeatureIds Struct section below.
    FeatureIds featureIds;
    // Metadata properties. See the Metadata Struct section below.
    Metadata metadata;
    // Metadata class properties. See the MetadataClass Struct section below.
    MetadataClass metadataClass;
    // Metadata statistics. See the Metadata Statistics Struct section below
    MetadataStatistics metadataStatistics;
};

*/
// precision  highp float;
// varying vec2 v_uv;

float random(vec2 st) {

  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
  vec3 color = vec3(0);
  vec3 originColor = mix(u_mix_color1, u_mix_color2, v_uv.y);
  float t = fract(u_time * 2.) * 2.;
  vec2 absUv = abs(v_uv - t);

  vec2 st = v_uv * 15.;
  vec2 ipos = floor(st + u_time * 5.);
  float r = random(ipos)+.2;

  float d = clamp(distance(0., absUv.y) / .2, 0., 1.);
  float diffuse = dot(czm_sunDirectionEC, fsInput.attributes.normalEC);
  diffuse = clamp(-diffuse, 0., .45);
  color += originColor;
  color = mix(u_sweep_color * r + u_sweep_color * .8, color, d);
  material.diffuse = color;

  material.emissive = vec3(diffuse) * (1. - d);
}