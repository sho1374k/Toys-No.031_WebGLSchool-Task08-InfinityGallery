import { WebGLMath } from "./WebGLMath";

export class Object {
  constructor(stage) {
    this.stage = stage;
    this.gl = stage.gl;
    this.canvas = stage.canvas;
    this.camera = stage.camera;

    this.program = null;
    this.drawCount = null;

    this.mesh = {
      geometry: null,
      position: {
        vbo: null,
        location: null,
        stride: null,
      },
      uv: {
        vbo: null,
        location: null,
        stride: null,
      },
      normal: {
        vbo: null,
        location: null,
        stride: null,
      },
      ibo: {
        buffer: null,
        length: null,
      },
    };

    this.uniforms = {};

    this.v2 = WebGLMath.Vec2;
    this.v3 = WebGLMath.Vec3;
    this.m4 = WebGLMath.Mat4;
    this.qtn = WebGLMath.Qtn;
  }

  /**
   * @param {boolean} bool
   */
  setCulling(bool = false) {
    const gl = this.gl;
    bool ? gl.enable(gl.CULL_FACE) : gl.disable(gl.CULL_FACE);
  }

  /**
   * @param {boolean} bool
   */
  setDepthTest(bool = true) {
    const gl = this.gl;
    bool ? gl.enable(gl.DEPTH_TEST) : gl.disable(gl.DEPTH_TEST);
  }

  /**
   * @param {Array} indexArray 頂点の結び順
   * @return {WebGLBuffer}
   */
  createIBO(indexArray) {
    const gl = this.gl;
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(indexArray), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  }

  /**
   * @param {WebGLBuffer} ibo index buffer
   */
  updateIBO(ibo) {
    const gl = this.gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  }

  /**
   * @param {Array.<number>} vertexArray
   * @return {WebGLBuffer}
   */
  createVBO(vertexArray) {
    const gl = this.gl;
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  }

  /**
   * @param {WebGLBuffer} vbo
   * @param {number} location
   * @param {number} stride
   */
  updateVBO(vbo, location, stride) {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, stride, gl.FLOAT, false, 0, 0);
  }

  /**
   * @param {string} name
   * @returns uniform
   */
  getUniform(name) {
    const gl = this.gl;
    const program = this.program;
    const location = gl.getUniformLocation(program, name);
    return gl.getUniform(program, location);
  }

  /**
   * @param {string} name
   */
  createUniform(name) {
    const gl = this.gl;
    const program = this.program;
    this.uniforms[name] = gl.getUniformLocation(program, name);
  }

  /**
   * @param {string} name
   * @param {string} type
   * @param {any} value
   */
  updateUniform(name, type, value, transpose = false) {
    const gl = this.gl;
    switch (type) {
      case "t":
        gl.uniform1i(this.uniforms[name], value); // sampler2D
        break;
      case "i":
        gl.uniform1i(this.uniforms[name], value); // int
        break;
      case "f":
        gl.uniform1f(this.uniforms[name], value); // float
        break;
      case "v1":
        gl.uniform1fv(this.uniforms[name], value); // vec1
        break;
      case "v2":
        gl.uniform2fv(this.uniforms[name], value); // vec2
        break;
      case "v3":
        gl.uniform3fv(this.uniforms[name], value); // vec3
        break;
      case "v4":
        gl.uniform4fv(this.uniforms[name], value); // vec4
        break;
      case "m2":
        gl.uniformMatrix2fv(this.uniforms[name], transpose, value); // mat2
        break;
      case "m3":
        gl.uniformMatrix3fv(this.uniforms[name], transpose, value); // mat3
        break;
      case "m4":
        gl.uniformMatrix4fv(this.uniforms[name], transpose, value); // mat4
        break;
      default:
        throw new Error("type is not defined");
        break;
    }
  }

  raf() {
    this.gl.useProgram(this.program);
  }
}
