
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

void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
  vec3 originColor = u_bg_color;
  vec3 color = u_line_color;
  vec2 st = fract(v_uv * 5.);
  float d = smoothstep(0., .05, abs(st.y-.5));
  color += vec3(d);
  color = mix(color,originColor,d);
  // material.diffuse  = color;
  // material.emissive += vec3(1.-d)*.3;
  material.emissive += color;

}