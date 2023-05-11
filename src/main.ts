window.CESIUM_BASE_URL = '/Cesium/';

import * as Cesium from 'cesium';
import axios from "axios"
import "cesium/Build/Cesium/Widgets/widgets.css";
import SweepShader from './shaders/tiles/sweepShader';
import LineShader from './shaders/tiles/lineShader';
import option from "../options.json"


import GUI from "lil-gui"
import FlowLightPolylineMaterialAppearance from './shaders/roat/flowLight';
const gui = new GUI


Cesium.Ion.defaultAccessToken = option.token

// Your access token can be found at: https://ion.cesium.com/tokens.
// Replace `your_access_token` with your Cesium ion access token.


// Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.
const viewer = new Cesium.Viewer('cesiumContainer', {
  // terrainProvider: Cesium.createWorldTerrain(),
  terrainProvider: new Cesium.EllipsoidTerrainProvider(),
  baseLayerPicker: false,
  skyAtmosphere: false,
  imageryProvider: false,
  // terrainProvider: new Cesium.ArcGISTiledElevationTerrainProvider({
  //   url:
  //       "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
  // }),
  infoBox: true
});

viewer.scene.imageryLayers.removeAll(true)
viewer.imageryLayers.removeAll(true)
viewer.scene.fog.enabled = true

viewer.scene.globe.show = false
// const buildingsTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings())
viewer.infoBox.frame.setAttribute("sandbox", "allow-same-origin allow-scripts allow-popups allow-forms")
// 810000
async function addBuildingGeoJSON(url): Promise<Cesium.DataSource> {
  const geoJSON = await Cesium.GeoJsonDataSource.load(url, { clampToGround: false })

  const dataSource: Cesium.DataSource = await viewer.dataSources.add(geoJSON)
  return dataSource
}

// 水
async function addWater() {
  const geoJSON = await axios.get("/geojson/hongkong_water.geojson")
  const features = geoJSON.data.features
  const instances = []
  for (const f of features) {
    for (const g of f.geometry.coordinates) {
      let dD = (<Array<any>>g).flat(2)
      const polygon = new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(dD)),
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
      })
      const geo = Cesium.PolygonGeometry.createGeometry(polygon)!
      instances.push(new Cesium.GeometryInstance({
        geometry: geo,

        attributes: { color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({ alpha: 0.7 })) }
      }))

    }
  }
  const primitive = new Cesium.Primitive({
    appearance: new Cesium.MaterialAppearance({ // 为每个instance着色
      translucent: true,
      closed: false,
      material: Cesium.Material.fromType("Water", {
        baseWaterColor: new Cesium.Color(80 / 255, 157 / 255, 1, 1),
        blendColor: new Cesium.Color(0.0, 0.0, 1.0, 0.3),
        normalMap: Cesium.buildModuleUrl("/waterNormals.jpg"),
        frequency: 200.0,
        animationSpeed: 0.01,
        amplitude: 10.0,
      })
    }),
    asynchronous: false,
    geometryInstances: instances
  })
  viewer.scene.primitives.add(primitive);
}
addWater()

// 中国底图
// addBuildingGeoJSON("/geojson/china_province.geojson").then(dataSource => {
//   let hongkong
//   const mat = new Cesium.Material({
//     fabric: {
//       type: "MyNewMaterial",
//       uniforms: {
//         color: new Cesium.Color(1.0, 0.0, 0.0, 1.0)
//       },
//       source: `czm_material czm_getMaterial(czm_materialInput materialInput)
//       {
//           czm_material m = czm_getDefaultMaterial(materialInput);
//           m.diffuse = vec3(0.5);
//           m.specular = 0.5;
//           return m;
//       }`
//     }
//   })
//   for (const entity of dataSource.entities.values) {
//     if (entity.properties.pr_adcode.getValue() === "810000") {
//       hongkong = entity
//       // entity.polyline.material = new Cesium.ColorMaterialProperty(Cesium.Color.PINK)
//       if (entity.polygon) {
//         entity.polygon.material = new Cesium.ColorMaterialProperty(Cesium.Color.BLACK)

//       }

//     }
//   }
//   // viewer.flyTo(dataSource)
// })

// 道路
async function getRoatData() {
  const geoJSON = await axios.get("/geojson/hongkong_line.geojson")
  console.log(geoJSON.data)
  const features = geoJSON.data.features
  const instances = []
  for (const f of features) {
    // if (f.properties.osm_id === "10808879"){
    for (const g of f.geometry.coordinates) {
      let dD: number[] = (<Array<any>>g).flat(2)
      const polyline = new Cesium.PolylineGeometry({
        positions: Cesium.Cartesian3.fromDegreesArray(dD),
        width: 2,
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
      })
      const geo = Cesium.PolylineGeometry.createGeometry(polyline)!

      const instance = new Cesium.GeometryInstance({
        geometry: geo,
        attributes: { color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({ alpha: 1. })) }
      })
      instances.push(instance)
    }
    // }
  }



  const primitive = new Cesium.Primitive({
    appearance: new FlowLightPolylineMaterialAppearance({ lightColor: new Cesium.Color(.5, 1, 1) }),
    asynchronous: false,
    geometryInstances: instances
  })

  viewer.scene.primitives.add(primitive);
}
getRoatData()
/*addBuildingGeoJSON("/geojson/line.geojson").then(dataSource => {
  for (const entity of dataSource.entities.values) {
    entity.polyline.width = 4
    entity.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
      color: new Cesium.Color(.5, .5, .8, 1.),
      outlineColor: new Cesium.Color(.5, 0, .6, 1.),
    })

    // entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN
  }



  ["bridleway",
    "construction",
    "cycleway",
    "footway",
    "living_street",
    "motorway",].forEach(key => {
      const e = document.querySelector("#" + key)
      e?.addEventListener("click", () => {
        for (const entity of dataSource.entities.values) {
          if (key === entity.properties?.getValue(Cesium.JulianDate.now()).highway) {
            entity.show = true
          } else {
            entity.show = false
          }
        }
      })
    })

})*/



// tileset
const newBuildingTileset: Cesium.Cesium3DTileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({ url: Cesium.IonResource.fromAssetId(1682930) }))
newBuildingTileset.readyPromise.then(tileset => {
  tileset.customShader = new SweepShader()

  // const boundingSphere = tileset.boundingSphere
  // const start = 
  // newBuildingTileset.show = false

  viewer.flyTo(newBuildingTileset)

})


const bloom = viewer.scene.postProcessStages.bloom
gui.add(bloom, "enabled")

gui.add(bloom.uniforms, "glowOnly")
gui.add(bloom.uniforms, "contrast")
gui.add(bloom.uniforms, "brightness")
gui.add(bloom.uniforms, "delta")
gui.add(bloom.uniforms, "sigma")
gui.add(bloom.uniforms, "stepSize")

console.log(viewer.scene.sun)
viewer.scene.postProcessStages.fxaa.enabled = true
// viewer.scene.sun.show =false
// viewer.scene.light.intensity = 0
viewer.scene.skyBox.show = false
viewer.scene.skyAtmosphere.show = false
viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT
viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT;
viewer.scene.globe.fillHighlightColor = Cesium.Color.TRANSPARENT;
viewer.scene.globe.undergroundColor = Cesium.Color.TRANSPARENT;

viewer.scene.debugShowFramesPerSecond = true