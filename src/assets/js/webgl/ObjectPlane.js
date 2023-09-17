// module
import { Object } from "./module/Object";
import { WebGLUtility } from "./module/WebGLUtility";
import { PlaneGeometry } from "./module/PlaneGeometry";

// shader
import fragmentShader from "../../shader/item.frag";
import vertexShader from "../../shader/item.vert";

export class ObjectPlane extends Object {
  constructor(stage, params, itemList) {
    super(stage);

    const vs = WebGLUtility.createFragmentShader(this.gl, fragmentShader);
    const fs = WebGLUtility.createVertexShader(this.gl, vertexShader);
    this.program = WebGLUtility.createProgramObject(this.gl, vs, fs);

    this.params = params;
    this.itemList = itemList;

    this.isCreatedMesh = false;
    this.isOpened = false;

    this.meshList = [];

    this.currentIndex = {
      fullscreen: null,
    };

    this.curve = {
      x: 0,
      y: 0,
      power: 0.3,
    };

    this.variable = {
      status: {
        scale: 0.0,
        before: 1,
        after: 0,
        open: 0.0,
        hide: 1.0,
      },
    };
  }

  createPlaneGeometry() {
    const gl = this.gl;
    const g = PlaneGeometry(1, 1, 32, 32);
    const position = {
      vbo: this.createVBO(g.position),
      location: gl.getAttribLocation(this.program, "position"),
      stride: 3,
    };
    const uv = {
      vbo: this.createVBO(g.uv),
      location: gl.getAttribLocation(this.program, "uv"),
      stride: 2,
    };
    const normal = {
      vbo: this.createVBO(g.normal),
      location: gl.getAttribLocation(this.program, "normal"),
      stride: 3,
    };
    const ibo = {
      buffer: this.createIBO(g.index),
      length: g.index.length,
    };

    this.planeGeometry = {
      position: position,
      uv: uv,
      normal: normal,
      ibo: ibo,
    };
  }

  createMesh() {
    const gl = this.gl;

    const position = this.planeGeometry.position;
    const uv = this.planeGeometry.uv;
    const normal = this.planeGeometry.normal;
    const ibo = this.planeGeometry.ibo;

    // sampler2D
    this.createUniform("uTexture");

    // float
    this.createUniform("uScale");
    this.createUniform("uPlaneAspect");
    this.createUniform("uTextureAspect");
    this.createUniform("uBorderRadius");
    this.createUniform("uOpen");
    this.createUniform("uHide");

    // vec2
    this.createUniform("uFullScale");
    this.createUniform("uResolution");
    this.createUniform("uCurve");
    this.createUniform("uMove");

    // mat4
    this.createUniform("uMvMatrix");
    this.createUniform("uProjectionMatrix");

    // mesh
    for (let i = 0; i < this.textureList.length; i++) {
      const data = this.textureList[i];
      const mesh = {
        position: position,
        uv: uv,
        normal: normal,
        ibo: ibo,
        texture: WebGLUtility.createTexture(gl, data.img),
        textureAspect: data.aspect,
        progress: {
          hover: 0.0,
        },
      };
      this.meshList.push(mesh);

      if (i === this.textureList.length - 1) this.isCreatedMesh = true;
    }
  }

  resize(params) {}

  raf(time, vector) {
    if (this.isCreatedMesh) {
      super.raf(time);

      const gl = this.gl;
      const m4 = this.m4;
      const v3 = this.v3;
      const params = {
        w: this.params.w,
        h: this.params.h,
      };

      const view = this.camera;
      const cameraPositionZ = this.camera.position[2];

      const fov = 45;
      const aspect = params.w / params.h;
      const near = 0.01;
      const far = (params.h / Math.tan((fov * Math.PI) / 360)) * 0.5;
      const projection = m4.perspective(fov, aspect, near, far);

      const coefficientScale = cameraPositionZ / far;
      params.w = params.w * coefficientScale;
      params.h = params.h * coefficientScale;

      const OPEN = 1.0 * this.variable.status.open;
      for (let i = 0; i < this.meshList.length; i++) {
        const isCurrent = this.currentIndex.fullscreen === i;
        const BEFORE = isCurrent ? this.variable.status.before : 1.0;
        const AFTER = isCurrent ? this.variable.status.after : 0.0;

        const mesh = this.meshList[i];
        const imgElement = this.imgList[i];
        const imgElementRect = imgElement.getBoundingClientRect();

        const scaleX = imgElementRect.width * coefficientScale;
        const scaleY = imgElementRect.height * coefficientScale;
        const scaleZ = 1.0;
        const scale = v3.create(scaleX, scaleY, scaleZ);

        const translateX = imgElementRect.x * coefficientScale - params.w * 0.5 + scaleX * 0.5;
        const translateY = imgElementRect.y * -1 * coefficientScale + params.h * 0.5 - scaleY * 0.5;
        const translateZ = 0.0;
        const translate = v3.create(translateX, translateY, translateZ);

        const rotateAxis = v3.create(1.0, 0.0, 0.0);
        let model = m4.translate(m4.identity(), translate); // 移動
        model = m4.scale(model, scale);
        model = m4.rotate(model, 0, rotateAxis);

        const mv = m4.multiply(view, model);
        const vp = m4.multiply(projection, view);
        // const mvp = m4.multiply(vp, model);

        const updateUniform = () => {
          const textureAspect = mesh.textureAspect;
          this.updateUniform("uTextureAspect", "f", textureAspect);

          const planeAspect = textureAspect * BEFORE + (params.w / params.h) * AFTER;
          this.updateUniform("uPlaneAspect", "f", planeAspect);

          this.updateUniform("uScale", "f", isCurrent ? this.variable.status.scale : 0.0);

          this.updateUniform("uBorderRadius", "f", 20.0 + 30 * mesh.progress.hover);

          this.updateUniform("uOpen", "f", isCurrent ? OPEN : 0.0);

          this.updateUniform("uHide", "f", isCurrent ? 1.0 : this.variable.status.hide);

          const fullScaleX = 1.0 * BEFORE + (params.w / scaleX) * AFTER;
          const fullScaleY = 1.0 * BEFORE + (params.h / scaleY) * AFTER;
          this.updateUniform("uFullScale", "v2", [fullScaleX, fullScaleY]);

          const moveX = translateX * 0.01 * BEFORE;
          const moveY = translateY * 0.01 * BEFORE;
          this.updateUniform("uMove", "v2", [moveX, moveY]);

          this.updateUniform("uResolution", "v2", [params.w, params.h]);

          this.updateUniform("uMvMatrix", "m4", mv);
          this.updateUniform("uProjectionMatrix", "m4", projection);
        };

        const updateCurve = () => {
          const target = {
            x: vector.target.x,
            y: vector.target.y,
          };

          const x = vector.current.x;
          const y = vector.current.y;

          // subtracts vector
          this.curve.x = target.x - x;
          this.curve.y = target.y - y;

          this.curve.x = this.curve.x / params.w;
          this.curve.y = this.curve.y / params.h;

          // multiply scalar
          this.curve.x *= this.curve.power;
          this.curve.y *= this.curve.power;
          this.updateUniform("uCurve", "v2", [this.curve.x, this.curve.y]);
        };

        const updateVbo = () => {
          this.updateVBO(mesh.position.vbo, mesh.position.location, mesh.position.stride);
          this.updateVBO(mesh.normal.vbo, mesh.normal.location, mesh.normal.stride);
          this.updateVBO(mesh.uv.vbo, mesh.uv.location, mesh.uv.stride);
        };

        const updateIbo = () => {
          this.updateIBO(mesh.ibo.buffer);
        };

        const activeTexture = () => {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, mesh.texture);
          this.updateUniform("uTexture", "t", 0);
        };

        const draw = () => {
          gl.drawElements(gl.TRIANGLES, mesh.ibo.length, gl.UNSIGNED_SHORT, 0);
        };

        updateUniform();
        updateCurve();
        updateVbo();
        updateIbo();
        activeTexture();
        draw();
      }
    }
  }

  toClickItem(i) {
    const DURATION1 = 1;
    const DURATION2 = DURATION1 * 0.5;
    const DELAY_SPACE = 0.3;

    return new Promise((resolve) => {
      this.currentIndex.fullscreen = i;

      if (this.isOpened) {
        // closing
        GSAP.to(this.variable.status, {
          duration: DURATION1,
          before: 1,
          after: 0,
          open: 0,
          scale: 0,
        });
        GSAP.to(this.variable.status, {
          duration: DURATION2,
          delay: DURATION1 - DELAY_SPACE,
          hide: 1.0,
          onComplete: () => {
            this.isOpened = false;
            resolve();
          },
        });
      } else {
        // opening
        GSAP.to(this.variable.status, {
          duration: DURATION1,
          delay: DURATION2 - DELAY_SPACE,
          before: 0,
          after: 1,
          open: 1,
          scale: 1,
          onComplete: () => {
            this.isOpened = true;
            resolve();
          },
        });
        GSAP.to(this.variable.status, {
          duration: DURATION2,
          hide: 0.0,
        });
      }
    });
  }

  init() {
    return new Promise((resolve) => {
      console.log("🚀 ~ Plane init");
      !(async () => {
        this.textureList = [];
        this.imgList = [];
        this.textureList = await Promise.all(
          this.itemList.map((ele) => {
            const img = ele.querySelector("img");
            this.imgList.push(img);
            return G.loadEleImg(img);
          }),
        );
        this.setCulling();
        this.setDepthTest();
        this.createPlaneGeometry();
        this.createMesh();
        resolve();
      })();
    });
  }
}
