import * as Cesium from "cesium"
import frag from "./frag.glsl?raw"

export default class FlowLightPolylineMaterialAppearance extends Cesium.PolylineMaterialAppearance {
  constructor(option: { lightColor?: Cesium.Color } = {}) {
    const { lightColor = new Cesium.Color(.5, 1, 1) } = option

    super({
      material: new Cesium.Material({
        fabric: {
          uniforms: {
            u_time: 0,
            light_color: lightColor
          }
        }
      }),
      fragmentShaderSource: frag
    })

    const task = (t) => {
      this.material.uniforms.u_time = t * .001
      requestAnimationFrame(task)
    }
    requestAnimationFrame(task)
  }
}