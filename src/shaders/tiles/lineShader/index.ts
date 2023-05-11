import * as Cesium from "cesium"
import vertex from "./vertex.glsl?raw"
import frag from "./frag.glsl?raw"


export default class SweepShader extends Cesium.CustomShader {
    lineColor: Cesium.Cartesian3
    bgColor: Cesium.Cartesian3

    constructor(opt: { [key in string]: Cesium.Cartesian3 } = {}) {
        const {
            lineColor = new Cesium.Cartesian3(0.0, 0.7333, 1.0),
            bgColor = new Cesium.Cartesian3(0) } = opt;

        super({
            vertexShaderText: vertex,
            fragmentShaderText: frag,
            uniforms: {
                u_line_color: {
                    value: lineColor,
                    type: Cesium.UniformType.VEC3
                },
                u_bg_color: {
                    value: bgColor,
                    type: Cesium.UniformType.VEC3
                },
            },
            varyings: {
                v_selectedColor: Cesium.VaryingType.VEC3,
                v_uv: Cesium.VaryingType.VEC2,
            },
        })


        this.lineColor = lineColor
        this.bgColor = bgColor
    }
}