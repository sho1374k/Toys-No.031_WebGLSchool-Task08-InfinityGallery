// module
import { Stage } from "./Stage";
import { ObjectPlane } from "./ObjectPlane";
import { ObjectFrameBufferOutPut } from "./ObjectFrameBufferOutPut";

export class WebGL {
  constructor(body, params, itemList) {
    this.body = body;
    this.params = params;
    this.isStart = false;

    this.stage = new Stage(params);
    this.stage.init(document.getElementById("webgl"), params.w, params.h);
    this.plane = new ObjectPlane(this.stage, params, itemList);
    this.output = new ObjectFrameBufferOutPut(this.stage, params);

    this.raf = this.raf.bind(this);
  }

  raf(vector) {
    const time = performance.now() * 0.001;
    if (this.isStart) {
      const gl = this.stage.gl;
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);

      this.output.ableFrameBuffer(time);
      this.stage.raf();
      this.plane.raf(time, vector);
      this.output.raf(time, this.plane.variable.status.open);
    }
  }

  resize(params) {
    this.params.w = params.w;
    this.params.h = params.h;

    if (this.isStart) {
      this.stage.resize(params.w, params.h);
      this.plane.resize(params);
      this.output.resize(params);
    }
  }

  init() {
    this.isStart = true;
    this.resize(this.params);
  }
}
