export class GlobalUtility {
  /**
   * @param {number} start
   * @param {number} end
   * @param {number} ease
   * @returns {number}
   */
  lerp(start, end, ease) {
    return start * (1 - ease) + end * ease;
  }

  /**
   * @param {number} num
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  clamp(num, min, max) {
    console.log(num, min, max);
    return min > num ? min : max < num ? max : num;
  }

  /**
   * 範囲を超えると反対の端点にする
   * @param {number} num
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  hoop(num, min, max) {
    const range = max - min + 1;
    let mod = (num - min) % range;
    if (0 > mod) {
      mod = range + mod;
    }
    return mod + min;
  }

  /**
   * @param {number} time
   * @returns
   */
  delay(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  /**
   * @param {string} name GET: key
   * @returns {string} // GET: value
   */
  getParameter(name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /**
   * @param {element} ele
   * @returns {Promise}
   */
  loadEleImg(ele) {
    return new Promise((resolve) => {
      const src = ele.getAttribute("src");
      const w = ele.getAttribute("width");
      const h = ele.getAttribute("height");

      const img = new Image();
      img.src = src;
      img.addEventListener("load", (e) => {
        const data = {
          img: img,
          src: src,
          w: w,
          h: h,
          aspect: w / h,
        };
        return resolve(data);
      });
    });
  }

  /**
   * @param {path} path
   * @returns {Promise}
   */
  loadImg(path) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = path;
      img.addEventListener("load", (e) => {
        return resolve(img);
      });
    });
  }

  /**
   * @param {string} hex // 16進数
   * @returns {Array<number>} [r, g, b]
   */
  hex2rgb(hex) {
    if (hex.slice(0, 1) === "#") hex = hex.slice(1);
    if (hex.length === 3)
      hex = hex.slice(0, 1) + hex.slice(0, 1) + hex.slice(1, 2) + hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2, 3);

    return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(function (str) {
      return parseInt(str, 16);
    });
  }

  /**
   * @param {Array<number>} rgb // [r, g, b] ← hex2rgb
   * @returns {Vec3}
   */
  rgbToGLSLColor(rgb) {
    const [r, g, b] = rgb;
    return [r / 255.0, g / 255.0, b / 255.0];
  }

  /**
   * @param {color} hex 16進数
   * @returns {vec4}
   */
  hexToGlslColor(hex, alpha = 1.0) {
    const vec3 = this.rgbToGLSLColor(this.hex2rgb(hex));
    const vec4 = vec3.concat([alpha]);
    return vec4;
  }

  /**
   * @param {Array<number>} rgb [r, g, b]
   * @returns
   */
  glslColorToHex(rgb) {
    // 範囲を 0 ~ 255 へ
    const r = Math.round(rgb[0] * 255);
    const g = Math.round(rgb[1] * 255);
    const b = Math.round(rgb[2] * 255);

    // 16進数に変換
    const rHex = r.toString(16).padStart(2, "0");
    const gHex = g.toString(16).padStart(2, "0");
    const bHex = b.toString(16).padStart(2, "0");

    // 最終的なhexカラーコードを生成して返します
    return `#${rHex}${gHex}${bHex}`;
  }
}
