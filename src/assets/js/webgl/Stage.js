// lib
import { WebGLMath } from "./module/WebGLMath.js";

export class Stage {
  constructor(params) {
    this.gl = null;
    this.canvas = null;
    this.camera = null;
    this.params = params;
    this.params.color = G.hexToGlslColor("#4a4a4a", 0.0);

    this.v3 = WebGLMath.Vec3;
    this.m4 = WebGLMath.Mat4;
  }

  createWebGLContext() {
    const gl = this.canvas.getContext("webgl2");
    if (gl == null) {
      throw new Error("webgl not supported");
      return null;
    } else {
      return gl;
    }
  }

  /**
   * @param {number} w
   * @param {number} h
   */
  setSize(w = window.innerWidth, h = window.innerHeight) {
    this.canvas.width = w;
    this.canvas.height = h;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  setViewport(x = 0, y = 0, w = this.canvas.width, h = this.canvas.height) {
    this.gl.viewport(x, y, w, h);
  }

  setCamera() {
    const eye = this.v3.create(0.0, 0.0, 100);
    const center = this.v3.create(0.0, 0.0, 0.0);
    const upDirection = this.v3.create(0.0, 1.0, 0.0);
    this.camera = this.m4.lookAt(eye, center, upDirection);
    this.camera.position = eye;
  }

  /**
   * @param {vec4} color
   */
  setClear(color = this.params.color) {
    this.params.color = color;
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  raf() {
    this.setViewport(0, 0, this.canvas.width, this.canvas.height);
    this.setClear();
  }

  /**
   * @param {number} w
   * @param {number} h
   */
  resize(w = window.innerWidth, h = window.innerHeight) {
    this.setSize(w, h);
    this.setViewport();
  }

  /**
   * @param {HTMLElement} canvas
   */
  init(canvas, w = window.innerWidth, h = window.innerHeight) {
    console.log("🚀 ~ Stage init");
    this.canvas = canvas;
    this.gl = this.createWebGLContext(this.canvas);

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);

    this.setSize(w, h);
    this.setViewport(0, 0, this.canvas.width, this.canvas.height);
    this.setClear();
    this.setCamera();
  }
}
