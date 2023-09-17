export class WebGLUtility {
  constructor() {
    this.v2 = WebGLMath.Vec2;
    this.v3 = WebGLMath.Vec3;
    this.m4 = WebGLMath.Mat4;
    this.qtn = WebGLMath.Qtn;
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {source} source
   * @param {number} type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
   * @returns {WebGLShader}
   */
  static createShaderObject(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      throw new Error(gl.getShaderInfoLog(shader));
      return null;
    }
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {source} source
   * @returns {WebGLShader}
   */
  static createFragmentShader(gl, source) {
    console.log("🙌 ~ create fragment");
    return this.createShaderObject(gl, source, gl.FRAGMENT_SHADER);
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {souce} source
   * @returns {WebGLShader}
   */
  static createVertexShader(gl, source) {
    console.log("🙌 ~ create vertex");
    return this.createShaderObject(gl, source, gl.VERTEX_SHADER);
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {WebGLShader} vs
   * @param {WebGLShader} fs
   * @returns {WebGLProgram}
   */
  static createProgramObject(gl, vs, fs) {
    const program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);

    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      return program;
    } else {
      throw new Error(gl.getProgramInfoLog(program));
      return null;
    }
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {any} resource
   * @return {WebGLTexture}
   */
  static createTexture(gl, resource) {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, resource);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {number} width
   * @param {number} height
   * @return {object}
   * @property {WebGLFramebuffer} framebuffer
   * @property {WebGLRenderbuffer} depthRenderBuffer
   * @property {WebGLTexture} texture
   */
  static createFramebuffer(gl, width, height) {
    const framebuffer = gl.createFramebuffer();
    const depthRenderBuffer = gl.createRenderbuffer();
    const texture = gl.createTexture();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return {
      framebuffer: framebuffer,
      depthRenderbuffer: depthRenderBuffer,
      texture: texture,
    };
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {WebGLFramebuffer} framebuffer
   * @param {WebGLRenderbuffer} renderbuffer
   * @param {WebGLTexture} texture
   */
  static deleteFramebuffer(gl, framebuffer, renderbuffer, texture) {
    gl.deleteFramebuffer(framebuffer);
    gl.deleteRenderbuffer(renderbuffer);
    gl.deleteTexture(texture);
    framebuffer = null;
    renderbuffer = null;
    texture = null;
  }
}