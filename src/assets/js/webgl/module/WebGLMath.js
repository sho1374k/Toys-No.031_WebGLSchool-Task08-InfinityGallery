
/**
 * @doxas https://twitter.com/h_doxas
 * ベクトルや行列演算の機能を提供する
 * @class
 */
export class WebGLMath {
  /**
   * @static
   * @type {Vec2}
   */
  static get Vec2() {return Vec2;}
  /**
   * @static
   * @type {Vec3}
   */
  static get Vec3() {return Vec3;}
  /**
   * @static
   * @type {Mat4}
   */
  static get Mat4() {return Mat4;}
  /**
   * @static
   * @type {Qtn}
   */
  static get Qtn() {return Qtn;}
}

/**
 * Vec2
 * @class Vec2
 */
class Vec2 {
  /**
   * ２つの要素を持つベクトルを生成する
   * @param {number} [x=0] - X 要素の値
   * @param {number} [y=0] - Y 要素の値
   * @return {Float32Array} ベクトル格納用の配列
   */
  static create(x = 0, y = 0) {
    const out = new Float32Array(2);
    out[0] = x;
    out[1] = y;
    return out;
  }
  /**
   * ベクトルの長さ（大きさ）を返す
   * @param {Vec2} v - ２つの要素を持つベクトル
   * @return {number} ベクトルの長さ（大きさ）
   */
  static length(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  }
  /**
   * ベクトルを正規化した結果を返す
   * @param {Vec2} v - ２つの要素を持つベクトル
   * @return {Vec2} 正規化したベクトル
   */
  static normalize(v) {
    const n = Vec2.create();
    const l = Vec2.length(v);
    if (l > 0) {
      const i = 1 / l;
      n[0] = v[0] * i;
      n[1] = v[1] * i;
    }
    return n;
  }
  /**
   * ２つのベクトルの内積の結果を返す
   * @param {Vec2} v0 - ２つの要素を持つベクトル
   * @param {Vec2} v1 - ２つの要素を持つベクトル
   * @return {number} 内積の結果
   */
  static dot(v0, v1) {
    return v0[0] * v1[0] + v0[1] * v1[1];
  }
  /**
   * ２つのベクトルの外積の結果を返す
   * @param {Vec2} v0 - ２つの要素を持つベクトル
   * @param {Vec2} v1 - ２つの要素を持つベクトル
   * @return {number} 外積の結果
   */
  static cross(v0, v1) {
    const n = Vec2.create();
    return v0[0] * v1[1] - v0[1] * v1[0];
  }
}

/**
 * Vec3
 * @class Vec3
 */
class Vec3 {
  /**
   * ３つの要素を持つベクトルを生成する
   * @param {number} [x=0] - X 要素の値
   * @param {number} [y=0] - Y 要素の値
   * @param {number} [z=0] - Z 要素の値
   * @return {Float32Array} ベクトル格納用の配列
   */
  static create(x = 0, y = 0, z = 0) {
    const out = new Float32Array(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  /**
   * ベクトルの長さ（大きさ）を返す
   * @param {Vec3} v - ３つの要素を持つベクトル
   * @return {number} ベクトルの長さ（大きさ）
   */
  static length(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }
  /**
   * ベクトルを正規化した結果を返す
   * @param {Vec3} v - ３つの要素を持つベクトル
   * @return {Vec3} 正規化したベクトル
   */
  static normalize(v) {
    const n = Vec3.create();
    const l = Vec3.length(v);
    if (l > 0) {
      const i = 1 / l;
      n[0] = v[0] * i;
      n[1] = v[1] * i;
      n[2] = v[2] * i;
    }
    return n;
  }
  /**
   * ２つのベクトルの内積の結果を返す
   * @param {Vec3} v0 - ３つの要素を持つベクトル
   * @param {Vec3} v1 - ３つの要素を持つベクトル
   * @return {number} 内積の結果
   */
  static dot(v0, v1) {
    return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
  }
  /**
   * ２つのベクトルの外積の結果を返す
   * @param {Vec3} v0 - ３つの要素を持つベクトル
   * @param {Vec3} v1 - ３つの要素を持つベクトル
   * @return {Vec3} 外積の結果
   */
  static cross(v0, v1) {
    return Vec3.create(
      v0[1] * v1[2] - v0[2] * v1[1],
      v0[2] * v1[0] - v0[0] * v1[2],
      v0[0] * v1[1] - v0[1] * v1[0],
    );
  }
  /**
   * ３つのベクトルから面法線を求めて返す
   * @param {Vec3} v0 - ３つの要素を持つベクトル
   * @param {Vec3} v1 - ３つの要素を持つベクトル
   * @param {Vec3} v2 - ３つの要素を持つベクトル
   * @return {Vec3} 面法線ベクトル
   */
  static faceNormal(v0, v1, v2) {
    const vec0 = Vec3.create(v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]);
    const vec1 = Vec3.create(v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]);
    const n = Vec3.create(
      vec0[1] * vec1[2] - vec0[2] * vec1[1],
      vec0[2] * vec1[0] - vec0[0] * vec1[2],
      vec0[0] * vec1[1] - vec0[1] * vec1[0],
    );
    return Vec3.normalize(n);
  }
}

/**
 * Mat4
 * @class Mat4
 */
class Mat4 {
  /**
   * 4x4 の正方行列を生成する
   * @return {Float32Array} 行列格納用の配列
   */
  static create() {
    return new Float32Array(16);
  }
  /**
   * 行列を単位化する（参照に注意）
   * @param {Mat4} dest - 単位化する行列
   * @return {Mat4} 単位化した行列
   */
  static identity(dest) {
    const out = dest == null ? Mat4.create() : dest;
    out[0]  = 1; out[1]  = 0; out[2]  = 0; out[3]  = 0;
    out[4]  = 0; out[5]  = 1; out[6]  = 0; out[7]  = 0;
    out[8]  = 0; out[9]  = 0; out[10] = 1; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
    return out;
  }
  /**
   * 行列を乗算する（参照に注意・戻り値としても結果を返す）
   * @param {Mat4} mat0 - 乗算される行列
   * @param {Mat4} mat1 - 乗算する行列
   * @param {Mat4} [dest] - 乗算結果を格納する行列
   * @return {Mat4} 乗算結果の行列
   */
  static multiply(mat0, mat1, dest) {
    const out = dest == null ? Mat4.create() : dest;
    const a = mat0[0],  b = mat0[1],  c = mat0[2],  d = mat0[3],
          e = mat0[4],  f = mat0[5],  g = mat0[6],  h = mat0[7],
          i = mat0[8],  j = mat0[9],  k = mat0[10], l = mat0[11],
          m = mat0[12], n = mat0[13], o = mat0[14], p = mat0[15],
          A = mat1[0],  B = mat1[1],  C = mat1[2],  D = mat1[3],
          E = mat1[4],  F = mat1[5],  G = mat1[6],  H = mat1[7],
          I = mat1[8],  J = mat1[9],  K = mat1[10], L = mat1[11],
          M = mat1[12], N = mat1[13], O = mat1[14], P = mat1[15];
    out[0]  = A * a + B * e + C * i + D * m;
    out[1]  = A * b + B * f + C * j + D * n;
    out[2]  = A * c + B * g + C * k + D * o;
    out[3]  = A * d + B * h + C * l + D * p;
    out[4]  = E * a + F * e + G * i + H * m;
    out[5]  = E * b + F * f + G * j + H * n;
    out[6]  = E * c + F * g + G * k + H * o;
    out[7]  = E * d + F * h + G * l + H * p;
    out[8]  = I * a + J * e + K * i + L * m;
    out[9]  = I * b + J * f + K * j + L * n;
    out[10] = I * c + J * g + K * k + L * o;
    out[11] = I * d + J * h + K * l + L * p;
    out[12] = M * a + N * e + O * i + P * m;
    out[13] = M * b + N * f + O * j + P * n;
    out[14] = M * c + N * g + O * k + P * o;
    out[15] = M * d + N * h + O * l + P * p;
    return out;
  }
  /**
   * 行列に拡大縮小を適用する（参照に注意・戻り値としても結果を返す）
   * @param {Mat4} mat - 適用を受ける行列
   * @param {Vec3} vec - XYZ の各軸に対して拡縮を適用する値の行列
   * @param {Mat4} [dest] - 結果を格納する行列
   * @return {Mat4} 結果の行列
   */
  static scale(mat, vec, dest) {
    const out = dest == null ? Mat4.create() : dest;
    out[0]  = mat[0]  * vec[0];
    out[1]  = mat[1]  * vec[0];
    out[2]  = mat[2]  * vec[0];
    out[3]  = mat[3]  * vec[0];
    out[4]  = mat[4]  * vec[1];
    out[5]  = mat[5]  * vec[1];
    out[6]  = mat[6]  * vec[1];
    out[7]  = mat[7]  * vec[1];
    out[8]  = mat[8]  * vec[2];
    out[9]  = mat[9]  * vec[2];
    out[10] = mat[10] * vec[2];
    out[11] = mat[11] * vec[2];
    out[12] = mat[12];
    out[13] = mat[13];
    out[14] = mat[14];
    out[15] = mat[15];
    return out;
  }
  /**
   * 行列に平行移動を適用する（参照に注意・戻り値としても結果を返す）
   * @param {Mat4} mat - 適用を受ける行列
   * @param {Vec3} vec - XYZ の各軸に対して平行移動を適用する値の行列
   * @param {Mat4} [dest] - 結果を格納する行列
   * @return {Mat4} 結果の行列
   */
  static translate(mat, vec, dest) {
    const out = dest == null ? Mat4.create() : dest;
    out[0] = mat[0]; out[1] = mat[1]; out[2]  = mat[2];  out[3]  = mat[3];
    out[4] = mat[4]; out[5] = mat[5]; out[6]  = mat[6];  out[7]  = mat[7];
    out[8] = mat[8]; out[9] = mat[9]; out[10] = mat[10]; out[11] = mat[11];
    out[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8]  * vec[2] + mat[12];
    out[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9]  * vec[2] + mat[13];
    out[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
    out[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
    return out;
  }
  /**
   * 行列に回転を適用する（参照に注意・戻り値としても結果を返す）
   * @param {Mat4} mat - 適用を受ける行列
   * @param {number} angle - 回転量を表す値（ラジアン）
   * @param {Vec3} axis - 回転の軸
   * @param {Mat4} [dest] - 結果を格納する行列
   * @return {Mat4} 結果の行列
   */
  static rotate(mat, angle, axis, dest) {
    let out = dest == null ? Mat4.create() : dest;
    const sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
    if (!sq) {
      return null;
    }
    let a = axis[0], b = axis[1], c = axis[2];
    if (sq != 1) {
      const inv = 1 / sq;
      a *= inv;
      b *= inv;
      c *= inv;
    }
    const d = Math.sin(angle), e = Math.cos(angle), f = 1 - e,
          g = mat[0], h = mat[1], i = mat[2],  j = mat[3],
          k = mat[4], l = mat[5], m = mat[6],  n = mat[7],
          o = mat[8], p = mat[9], q = mat[10], r = mat[11],
          s = a * a * f + e,
          t = b * a * f + c * d,
          u = c * a * f - b * d,
          v = a * b * f - c * d,
          w = b * b * f + e,
          x = c * b * f + a * d,
          y = a * c * f + b * d,
          z = b * c * f - a * d,
          A = c * c * f + e;
    if (angle) {
      if (mat != out) {
        out[12] = mat[12];
        out[13] = mat[13];
        out[14] = mat[14];
        out[15] = mat[15];
      }
    } else {
      out = mat;
    }
    out[0]  = g * s + k * t + o * u;
    out[1]  = h * s + l * t + p * u;
    out[2]  = i * s + m * t + q * u;
    out[3]  = j * s + n * t + r * u;
    out[4]  = g * v + k * w + o * x;
    out[5]  = h * v + l * w + p * x;
    out[6]  = i * v + m * w + q * x;
    out[7]  = j * v + n * w + r * x;
    out[8]  = g * y + k * z + o * A;
    out[9]  = h * y + l * z + p * A;
    out[10] = i * y + m * z + q * A;
    out[11] = j * y + n * z + r * A;
    return out;
  }
  /**
   * ビュー座標変換行列を生成する（参照に注意・戻り値としても結果を返す）
   * @param {Vec3} eye - 視点位置
   * @param {Vec3} center - 注視点
   * @param {Vec3} up - 上方向を示すベクトル
   * @param {Mat4} [dest] - 結果を格納する行列
   * @return {Mat4} 結果の行列
   */
  static lookAt(eye, center, up, dest) {
    const out = dest == null ? Mat4.create() : dest;
    const eyeX    = eye[0],    eyeY    = eye[1],    eyeZ    = eye[2],
          centerX = center[0], centerY = center[1], centerZ = center[2],
          upX     = up[0],     upY     = up[1],     upZ     = up[2];
    if (eyeX == centerX && eyeY == centerY && eyeZ == centerZ) {
      return Mat4.identity(out);
    }
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
    z0 = eyeX - centerX;
    z1 = eyeY - centerY;
    z2 = eyeZ - centerZ;
    l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= l;
    z1 *= l;
    z2 *= l;
    x0 = upY * z2 - upZ * z1;
    x1 = upZ * z0 - upX * z2;
    x2 = upX * z1 - upY * z0;
    l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!l) {
      x0 = 0; x1 = 0; x2 = 0;
    } else {
      l = 1 / l;
      x0 *= l; x1 *= l; x2 *= l;
    }
    y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
    l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!l) {
      y0 = 0; y1 = 0; y2 = 0;
    } else {
      l = 1 / l;
      y0 *= l; y1 *= l; y2 *= l;
    }
    out[0] = x0; out[1] = y0; out[2]  = z0; out[3]  = 0;
    out[4] = x1; out[5] = y1; out[6]  = z1; out[7]  = 0;
    out[8] = x2; out[9] = y2; out[10] = z2; out[11] = 0;
    out[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
    out[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
    out[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
    out[15] = 1;
    return out;
  }
  /**
   * 透視投影変換行列を生成する（参照に注意・戻り値としても結果を返す）
   * @param {number} fovy - 視野角（度数法）
   * @param {number} aspect - アスペクト比（幅 / 高さ）
   * @param {number} near - ニアクリップ面までの距離
   * @param {number} far - ファークリップ面までの距離
   * @param {Mat4} [dest] - 結果を格納する行列
   * @return {Mat4} 結果の行列
   */
  static perspective(fovy, aspect, near, far, dest) {
    const out = dest == null ? Mat4.create() : dest;
    const t = near * Math.tan(fovy * Math.PI / 360);
    const r = t * aspect;
    const a = r * 2, b = t * 2, c = far - near;
    out[0]  = near * 2 / a;
    out[1]  = 0;
    out[2]  = 0;
    out[3]  = 0;
    out[4]  = 0;
    out[5]  = near * 2 / b;
    out[6]  = 0;
    out[7]  = 0;
    out[8]  = 0;
    out[9]  = 0;
    out[10] = -(far + near) / c;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = -(far * near * 2) / c;
    out[15] = 0;
    return out;
  }
  /**
   * 正射影投影変換行列を生成する（参照に注意・戻り値としても結果を返す）
   * @param {number} left - 左端
   * @param {number} right - 右端
   * @param {number} top - 上端
   * @param {number} bottom - 下端
   * @param {number} near - ニアクリップ面までの距離
   * @param {number} far - ファークリップ面までの距離
   * @param {Mat4} [dest] - 結果を格納する行列
   * @return {Mat4} 結果の行列
   */
  static ortho(left, right, top, bottom, near, far, dest) {
    const out = dest == null ? Mat4.create() : dest;
    const h = right - left;
    const v = top - bottom;
    const d = far - near;
    out[0]  = 2 / h;
    out[1]  = 0;
    out[2]  = 0;
    out[3]  = 0;
    out[4]  = 0;
    out[5]  = 2 / v;
    out[6]  = 0;
    out[7]  = 0;
    out[8]  = 0;
    out[9]  = 0;
    out[10] = -2 / d;
    out[11] = 0;
    out[12] = -(left + right) / h;
    out[13] = -(top + bottom) / v;
    out[14] = -(far + near) / d;
    out[15] = 1;
    return out;
  }
  /**
   * 転置行列を生成する（参照に注意・戻り値としても結果を返す）
   * @param {Mat4} mat - 適用する行列
   * @param {Mat4} [dest] - 結果を格納する行列
   * @return {Mat4} 結果の行列
   */
  static transpose(mat, dest) {
    const out = dest == null ? Mat4.create() : dest;
    out[0]  = mat[0];  out[1]  = mat[4];
    out[2]  = mat[8];  out[3]  = mat[12];
    out[4]  = mat[1];  out[5]  = mat[5];
    out[6]  = mat[9];  out[7]  = mat[13];
    out[8]  = mat[2];  out[9]  = mat[6];
    out[10] = mat[10]; out[11] = mat[14];
    out[12] = mat[3];  out[13] = mat[7];
    out[14] = mat[11]; out[15] = mat[15];
    return out;
  }
  /**
   * 逆行列を生成する（参照に注意・戻り値としても結果を返す）
   * @param {Mat4} mat - 適用する行列
   * @param {Mat4} [dest] - 結果を格納する行列
   * @return {Mat4} 結果の行列
   */
  static inverse(mat, dest) {
    const out = dest == null ? Mat4.create() : dest;
    const a = mat[0],  b = mat[1],  c = mat[2],  d = mat[3],
          e = mat[4],  f = mat[5],  g = mat[6],  h = mat[7],
          i = mat[8],  j = mat[9],  k = mat[10], l = mat[11],
          m = mat[12], n = mat[13], o = mat[14], p = mat[15],
          q = a * f - b * e, r = a * g - c * e,
          s = a * h - d * e, t = b * g - c * f,
          u = b * h - d * f, v = c * h - d * g,
          w = i * n - j * m, x = i * o - k * m,
          y = i * p - l * m, z = j * o - k * n,
          A = j * p - l * n, B = k * p - l * o,
          ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
    out[0]  = ( f * B - g * A + h * z) * ivd;
    out[1]  = (-b * B + c * A - d * z) * ivd;
    out[2]  = ( n * v - o * u + p * t) * ivd;
    out[3]  = (-j * v + k * u - l * t) * ivd;
    out[4]  = (-e * B + g * y - h * x) * ivd;
    out[5]  = ( a * B - c * y + d * x) * ivd;
    out[6]  = (-m * v + o * s - p * r) * ivd;
    out[7]  = ( i * v - k * s + l * r) * ivd;
    out[8]  = ( e * A - f * y + h * w) * ivd;
    out[9]  = (-a * A + b * y - d * w) * ivd;
    out[10] = ( m * u - n * s + p * q) * ivd;
    out[11] = (-i * u + j * s - l * q) * ivd;
    out[12] = (-e * z + f * x - g * w) * ivd;
    out[13] = ( a * z - b * x + c * w) * ivd;
    out[14] = (-m * t + n * r - o * q) * ivd;
    out[15] = ( i * t - j * r + k * q) * ivd;
    return out;
  }
  /**
   * 行列にベクトルを乗算する（ベクトルに行列を適用する）
   * @param {Mat4} mat - 適用する行列
   * @param {Array.<number>} vec - 乗算するベクトル（4 つの要素を持つ配列）
   * @return {Float32Array} 結果のベクトル
   */
  static toVecIV(mat, vec) {
    const a = mat[0],  b = mat[1],  c = mat[2],  d = mat[3],
          e = mat[4],  f = mat[5],  g = mat[6],  h = mat[7],
          i = mat[8],  j = mat[9],  k = mat[10], l = mat[11],
          m = mat[12], n = mat[13], o = mat[14], p = mat[15],
          x = vec[0], y = vec[1], z = vec[2], w = vec[3];
    const out = new Float32Array(4);
    out[0] = x * a + y * e + z * i + w * m;
    out[1] = x * b + y * f + z * j + w * n;
    out[2] = x * c + y * g + z * k + w * o;
    out[3] = x * d + y * h + z * l + w * p;
    return out;
  }
  /**
   * MVP 行列に相当する行列を受け取りベクトルを変換して返す
   * @param {Mat4} mat - MVP 行列
   * @param {Vec3} vec - MVP 行列と乗算するベクトル
   * @param {number} width - ビューポートの幅
   * @param {number} height - ビューポートの高さ
   * @return {Vec2} 結果のベクトル
   */
  static screenPositionFromMvp(mat, vec, width, height) {
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const v = Mat4.toVecIV(mat, [vec[0], vec[1], vec[2], 1.0]);
    if (v[3] <= 0.0) {
      return [NaN, NaN];
    }
    v[0] /= v[3];
    v[1] /= v[3];
    v[2] /= v[3];
    const out = Vec2.create();
    out[0] = halfWidth + v[0] * halfWidth,
    out[1] = halfHeight - v[1] * halfHeight
    return out;
  }
}

/**
 * Qtn
 * @class Qtn
 */
class Qtn {
  /**
   * 4 つの要素からなるクォータニオンのデータ構造を生成する（虚部 x, y, z, 実部 w の順序で定義）
   * @return {Float32Array} クォータニオンデータ格納用の配列
   */
  static create() {
    return new Float32Array(4);
  }
  /**
   * クォータニオンを初期化する（参照に注意）
   * @param {Qtn} dest - 初期化するクォータニオン
   * @return {Qtn} 結果のクォータニオン
   */
  static identity(dest) {
    const out = dest == null ? Qtn.create() : dest;
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }
  /**
   * 共役四元数を生成して返す（参照に注意・戻り値としても結果を返す）
   * @param {Qtn} qtn - 元となるクォータニオン
   * @param {Qtn} [dest] - 結果を格納するクォータニオン
   * @return {Qtn} 結果のクォータニオン
   */
  static inverse(qtn, dest) {
    const out = dest == null ? Qtn.create() : dest;
    out[0] = -qtn[0];
    out[1] = -qtn[1];
    out[2] = -qtn[2];
    out[3] =  qtn[3];
    return out;
  }
  /**
   * 虚部を正規化した結果を返す
   * @param {Qtn} qtn - 元となるクォータニオン
   * @return {Qtn} 結果のクォータニオン
   */
  static normalize(qtn) {
    const out = Qtn.create();
    const x = qtn[0], y = qtn[1], z = qtn[2];
    const l = Math.sqrt(x * x + y * y + z * z);
    if (l > 0) {
      const i = 1 / l;
      out[0] = x * i;
      out[1] = y * i;
      out[2] = z * i;
    }
    return out;
  }
  /**
   * クォータニオンを乗算した結果を返す（参照に注意・戻り値としても結果を返す）
   * @param {Qtn} qtn0 - 乗算されるクォータニオン
   * @param {Qtn} qtn1 - 乗算するクォータニオン
   * @param {Qtn} [dest] - 結果を格納するクォータニオン
   * @return {Qtn} 結果のクォータニオン
   */
  static multiply(qtn0, qtn1, dest) {
    const out = dest == null ? Qtn.create() : dest;
    const ax = qtn0[0], ay = qtn0[1], az = qtn0[2], aw = qtn0[3];
    const bx = qtn1[0], by = qtn1[1], bz = qtn1[2], bw = qtn1[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  /**
   * クォータニオンに回転を適用し返す（参照に注意・戻り値としても結果を返す）
   * @param {number} angle - 回転する量（ラジアン）
   * @param {Vec3} axis - ３つの要素を持つ軸ベクトル
   * @param {Qtn} [dest] - 結果を格納するクォータニオン
   * @return {Qtn} 結果のクォータニオン
   */
  static rotate(angle, axis, dest) {
    const out = dest == null ? Qtn.create() : dest;
    let a = axis[0], b = axis[1], c = axis[2];
    const sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
    if (sq !== 0) {
      const l = 1 / sq;
      a *= l;
      b *= l;
      c *= l;
    }
    const s = Math.sin(angle * 0.5);
    out[0] = a * s;
    out[1] = b * s;
    out[2] = c * s;
    out[3] = Math.cos(angle * 0.5);
    return out;
  }
  /**
   * ベクトルにクォータニオンを適用し返す（参照に注意・戻り値としても結果を返す）
   * @param {Vec3} vec - ３つの要素を持つベクトル
   * @param {Qtn} qtn - クォータニオン
   * @param {Vec3} [dest] - ３つの要素を持つベクトル
   * @return {Vec3} 結果のベクトル
   */
  static toVecIII(vec, qtn, dest) {
    const out = dest == null ? Vec3.create() : dest;
    const qp = Qtn.create();
    const qq = Qtn.create();
    const qr = Qtn.create();
    Qtn.inverse(qtn, qr);
    qp[0] = vec[0];
    qp[1] = vec[1];
    qp[2] = vec[2];
    Qtn.multiply(qr, qp, qq);
    Qtn.multiply(qq, qtn, qr);
    out[0] = qr[0];
    out[1] = qr[1];
    out[2] = qr[2];
    return out;
  }
  /**
   * 4x4 行列にクォータニオンを適用し返す（参照に注意・戻り値としても結果を返す）
   * @param {Qtn} qtn - クォータニオン
   * @param {Mat4} [dest] - 4x4 行列
   * @return {Mat4} 結果の行列
   */
  static toMatIV(qtn, dest) {
    const out = dest == null ? Mat4.create() : dest;
    const x = qtn[0], y = qtn[1], z = qtn[2], w = qtn[3];
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;
    out[0]  = 1 - (yy + zz);
    out[1]  = xy - wz;
    out[2]  = xz + wy;
    out[3]  = 0;
    out[4]  = xy + wz;
    out[5]  = 1 - (xx + zz);
    out[6]  = yz - wx;
    out[7]  = 0;
    out[8]  = xz - wy;
    out[9]  = yz + wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * ２つのクォータニオンの球面線形補間を行った結果を返す（参照に注意・戻り値としても結果を返す）
   * @param {Qtn} qtn0 - クォータニオン
   * @param {Qtn} qtn1 - クォータニオン
   * @param {number} time - 補間係数（0.0 から 1.0 で指定）
   * @param {Qtn} [dest] - 結果を格納するクォータニオン
   * @return {Qtn} 結果のクォータニオン
   */
  static slerp(qtn0, qtn1, time, dest) {
    const out = dest == null ? Qtn.create() : dest;
    const ht = qtn0[0] * qtn1[0] + qtn0[1] * qtn1[1] + qtn0[2] * qtn1[2] + qtn0[3] * qtn1[3];
    let hs = 1.0 - ht * ht;
    if (hs <= 0.0) {
      out[0] = qtn0[0];
      out[1] = qtn0[1];
      out[2] = qtn0[2];
      out[3] = qtn0[3];
    } else {
      hs = Math.sqrt(hs);
      if (Math.abs(hs) < 0.0001) {
        out[0] = (qtn0[0] * 0.5 + qtn1[0] * 0.5);
        out[1] = (qtn0[1] * 0.5 + qtn1[1] * 0.5);
        out[2] = (qtn0[2] * 0.5 + qtn1[2] * 0.5);
        out[3] = (qtn0[3] * 0.5 + qtn1[3] * 0.5);
      } else {
        const ph = Math.acos(ht);
        const pt = ph * time;
        const t0 = Math.sin(ph - pt) / hs;
        const t1 = Math.sin(pt) / hs;
        out[0] = qtn0[0] * t0 + qtn1[0] * t1;
        out[1] = qtn0[1] * t0 + qtn1[1] * t1;
        out[2] = qtn0[2] * t0 + qtn1[2] * t1;
        out[3] = qtn0[3] * t0 + qtn1[3] * t1;
      }
    }
    return out;
  }
}

