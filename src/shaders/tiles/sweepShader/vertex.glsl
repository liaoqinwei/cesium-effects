/**
struct VertexInput {
    // Processed attributes. See the Attributes Struct section below.
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

void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
  v_uv = vec2(vsInput.attributes.positionMC.x / 80., vsInput.attributes.positionMC.y / 250.);
}