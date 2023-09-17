// module
import { Object } from "./Object";
import { WebGLUtility } from "./WebGLUtility";
import { PlaneGeometry } from "./PlaneGeometry";

export class ObjectFrameBuffer extends Object {
  constructor(stage, frameBufferLength = 1) {
    super(stage);
    this.frameBufferLength = frameBufferLength;
    this.frameBufferList = null;
  }

  createPlaneGeometry(widthSegments = 1, heightSegments = 1) {
    const gl = this.gl;
    const g = PlaneGeometry(2, 2, widthSegments, heightSegments);

    this.mesh.position.vbo = this.createVBO(g.position);
    this.mesh.position.location = gl.getAttribLocation(this.program, "position");
    this.mesh.position.stride = 3;

    this.mesh.uv.vbo = this.createVBO(g.uv);
    this.mesh.uv.location = gl.getAttribLocation(this.program, "uv");
    this.mesh.uv.stride = 2;

    this.mesh.normal.vbo = this.createVBO(g.normal);
    this.mesh.normal.location = gl.getAttribLocation(this.program, "normal");
    this.mesh.normal.stride = 3;

    this.mesh.ibo.buffer = this.createIBO(g.index);
    this.mesh.ibo.length = g.index.length;
  }

  ableFrameBuffer() {
    if (this.frameBufferList != null) {
      const gl = this.gl;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferList[0].framebuffer);
    }
  }

  setFrameBuffer(w, h) {
    if (this.frameBufferList != null) {
      this.frameBufferList.forEach((buffer) => {
        WebGLUtility.deleteFramebuffer(this.gl, buffer.framebuffer, buffer.renderbuffer, buffer.texture);
      });
    }

    this.frameBufferList = [];
    for (let i = 0; i < this.frameBufferLength; i++) {
      this.frameBufferList.push(WebGLUtility.createFramebuffer(this.gl, w, h));
    }
  }

  resize(params) {
    params.w;
    params.h;
    this.setFrameBuffer(params.w, params.h);
  }

  raf() {
    super.raf();
  }
}
