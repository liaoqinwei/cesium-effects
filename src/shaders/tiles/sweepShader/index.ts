import * as Cesium from "cesium"
import vertex from "./vertex.glsl?raw"
import frag from "./frag.glsl?raw"


export default class SweepShader extends Cesium.CustomShader {
    sweepColor: Cesium.Cartesian3
    mixColor1: Cesium.Cartesian3
    mixColor2: Cesium.Cartesian3

    constructor(opt: { [key in string]: Cesium.Cartesian3 } = {}) {
        const { sweepColor = new Cesium.Cartesian3(0.5765, 0.8157, 1.0),
            mixColor1 = new Cesium.Cartesian3(0.7333, 1.0, 0.902),
            mixColor2 = new Cesium.Cartesian3(1.0, 0.4118, 0.3098) } = opt;

        console.log(mixColor1)
        super({
            vertexShaderText: vertex,
            fragmentShaderText: frag,
            uniforms: {
                u_sweep_color: {
                    value: sweepColor,
                    type: Cesium.UniformType.VEC3
                },
                u_mix_color1: {
                    value: mixColor1,
                    type: Cesium.UniformType.VEC3
                },
                u_mix_color2: {
                    value: mixColor2,
                    type: Cesium.UniformType.VEC3
                },
                u_time: {
                    value: 0, // initial value
                    type: Cesium.UniformType.FLOAT
                },

            },
            varyings: {
                v_selectedColor: Cesium.VaryingType.VEC3,
                v_uv: Cesium.VaryingType.VEC2,
            },
        })


        this.sweepColor = sweepColor
        this.mixColor1 = mixColor1
        this.mixColor2 = mixColor2

        const task = (t: number) => {
            this.setUniform("u_time", t * .001)
            requestAnimationFrame(task)
        }
        requestAnimationFrame(task)
    }
}