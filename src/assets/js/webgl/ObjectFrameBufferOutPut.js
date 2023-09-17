// module
import { ObjectFrameBuffer } from "./module/ObjectFrameBuffer";
import { WebGLUtility } from "./module/WebGLUtility";

// shader
import curveFragmentShader from "../../shader/output.frag";
import curveVertexShader from "../../shader/output.vert";

export class ObjectFrameBufferOutPut extends ObjectFrameBuffer {
  constructor(stage, params) {
    super(stage, 1);
    const vs = WebGLUtility.createFragmentShader(this.gl, curveFragmentShader);
    const fs = WebGLUtility.createVertexShader(this.gl, curveVertexShader);
    this.program = WebGLUtility.createProgramObject(this.gl, vs, fs);

    this.params = params;

    this.texture = {
      new: null,
      old: null,
    };

    this.variable = {
      maskProgress: 1.0,
    };

    this.mouse = {
      current: {
        x: 0,
        y: 0,
      },
      target: {
        x: 0,
        y: 0,
      },
      ease: 0.1,
    };

    if (window.matchMedia("(hover: hover)").matches) {
      window.addEventListener("mousemove", this.onMouseMove.bind(this), { passive: true });
    }
  }

  createMesh() {
    this.createPlaneGeometry();
    this.createUniform("uTexture");
    this.createUniform("uTextureOld");
    this.createUniform("uMouse");
    this.createUniform("uResolution");
    this.createUniform("uOpened");
    this.createUniform("uMaskProgress");
  }

  onMouseMove(e) {
    const x = (e.clientX / this.params.w) * 2 - 1.0;
    const y = (e.clientY / this.params.h) * -2 + 1.0;
    this.mouse.target.x = x;
    this.mouse.target.y = y;
  }

  resize(params) {
    this.params.w = params.w;
    this.params.h = params.h;
    this.setFrameBuffer(params.w, params.h);
  }

  raf(time, open) {
    if (this.frameBufferList != null) {
      const gl = this.gl;

      super.raf();

      const clearBindFrameBuffer = () => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      };

      const clearStage = () => {
        this.stage.raf();
      };

      const setBindFrameBufferTexture = () => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.frameBufferList[0].texture);
      };

      const updateTexture = () => {
        this.texture.old = this.frameBufferList[0].texture;
        gl.activeTexture(gl.TEXTURE0 + 1);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.old);
      };

      const updateUniform = () => {
        this.updateUniform("uTexture", "t", 0);
        this.updateUniform("uTextureOld", "t", 1);
        this.updateUniform("uResolution", "v2", [this.params.w, this.params.h]);
        this.updateUniform("uOpened", "f", open);
        this.updateUniform("uMaskProgress", "f", this.variable.maskProgress);
      };

      const updateMouseMove = () => {
        this.mouse.current.x = G.lerp(this.mouse.current.x, this.mouse.target.x, this.mouse.ease);
        this.mouse.current.y = G.lerp(this.mouse.current.y, this.mouse.target.y, this.mouse.ease);

        const target = {
          x: this.mouse.target.x,
          y: this.mouse.target.y,
        };

        const x = this.mouse.current.x;
        const y = this.mouse.current.y;

        // subtracts vector
        const value = {
          x: target.x - x,
          y: target.y - y,
        };

        // multiply scalar
        value.x *= 0.3;
        value.y *= 0.3;
        this.updateUniform("uMouse", "v2", [value.x, value.y]);
      };

      const updateVbo = () => {
        this.updateVBO(this.mesh.position.vbo, this.mesh.position.location, this.mesh.position.stride);
        this.updateVBO(this.mesh.normal.vbo, this.mesh.normal.location, this.mesh.normal.stride);
        this.updateVBO(this.mesh.uv.vbo, this.mesh.uv.location, this.mesh.uv.stride);
      };

      const updateIbo = () => {
        this.updateIBO(this.mesh.ibo.buffer);
      };

      const draw = () => {
        gl.drawElements(gl.TRIANGLES, this.mesh.ibo.length, gl.UNSIGNED_SHORT, 0);
      };

      clearBindFrameBuffer();
      clearStage();
      setBindFrameBufferTexture();
      updateUniform();
      updateMouseMove();
      updateVbo();
      updateIbo();
      draw();
      updateTexture();
    }
  }

  init() {
    console.log("🚀 ~ OutPut init");
    this.createMesh();
  }
}
