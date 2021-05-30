var xsthree = (function (exports) {
  'use strict';

  const EPSILON = 0.000001;
  let ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;

  /**
   * Creates a new identity mat4
   *
   * @returns {mat4} a new 4x4 matrix
   */
  function create() {
    let out = new ARRAY_TYPE(16);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }

  /**
   * Set a mat4 to the identity matrix
   *
   * @param {mat4} out the receiving matrix
   * @returns {mat4} out
   */
  function identity$1(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }

  /**
   * Inverts a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the source matrix
   * @returns {mat4} out
   */
  function invert(out, a) {
    let a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
    let a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
    let a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
    let a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];

    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det =
      b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
  }

  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {ReadonlyVec3} eye Position of the viewer
   * @param {ReadonlyVec3} center Point the viewer is looking at
   * @param {ReadonlyVec3} up vec3 pointing up
   * @returns {mat4} out
   */
  function lookAt(out, eye, center, up) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye[0];
    let eyey = eye[1];
    let eyez = eye[2];
    let upx = up[0];
    let upy = up[1];
    let upz = up[2];
    let centerx = center[0];
    let centery = center[1];
    let centerz = center[2];

    if (
      Math.abs(eyex - centerx) < EPSILON &&
      Math.abs(eyey - centery) < EPSILON &&
      Math.abs(eyez - centerz) < EPSILON
    ) {
      return identity$1(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.hypot(y0, y1, y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
  }

  /**
   * Generates a orthogonal projection matrix with the given bounds
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} left Left bound of the frustum
   * @param {number} right Right bound of the frustum
   * @param {number} bottom Bottom bound of the frustum
   * @param {number} top Top bound of the frustum
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @returns {mat4} out
   */
  function ortho(out, left, right, bottom, top, near, far) {
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }

  /**
   * Generates a perspective projection matrix with the given bounds.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} fovy Vertical field of view in radians
   * @param {number} aspect Aspect ratio. typically viewport width/height
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum, can be null or Infinity
   * @returns {mat4} out
   */
  function perspective(out, fovy, aspect, near, far) {
    let f = 1.0 / Math.tan(fovy / 2),
      nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }

  /**
   * Rotates a mat4 by the given angle around the given axis
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @param {ReadonlyVec3} axis the axis to rotate around
   * @returns {mat4} out
   */
  function rotate(out, a, rad, axis) {
    let x = axis[0],
      y = axis[1],
      z = axis[2];
    let len = Math.hypot(x, y, z);
    let s, c, t;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;

    if (len < EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) {
      // If the source and destination differ, copy the unchanged last row
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  }

  /**
   * Rotates a matrix by the given angle around the X axis
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */
  function rotateX(out, a, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    let a10 = a[4];
    let a11 = a[5];
    let a12 = a[6];
    let a13 = a[7];
    let a20 = a[8];
    let a21 = a[9];
    let a22 = a[10];
    let a23 = a[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }

  /**
   * Rotates a matrix by the given angle around the Y axis
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */
  function rotateY(out, a, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    let a00 = a[0];
    let a01 = a[1];
    let a02 = a[2];
    let a03 = a[3];
    let a20 = a[8];
    let a21 = a[9];
    let a22 = a[10];
    let a23 = a[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }

  /**
   * Scales the mat4 by the dimensions in the given vec3 not using vectorization
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the matrix to scale
   * @param {ReadonlyVec3} v the vec3 to scale the matrix by
   * @returns {mat4} out
   **/
  function scale(out, a, v) {
    let x = v[0],
      y = v[1],
      z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }

  /**
   * Set the components of a mat4 to the given values
   *
   * @param {mat4} out the receiving matrix
   * @returns {mat4} out
   */
  function set$3(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }

  /**
   * Translate a mat4 by the given vector
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the matrix to translate
   * @param {ReadonlyVec3} v vector to translate by
   * @returns {mat4} out
   */
  function translate(out, a, v) {
    let x = v[0],
      y = v[1],
      z = v[2];
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;

    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];

      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;

      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
  }

  const mat4fn = () => {
    const me = {
      value: create(),
    };

    return {
      ...me,
      identity () {
        identity$1(me.value);
        return me;
      },
      invert(a) {
        invert(me.value, a);
        return me;
      },
      lookAt(eye, center, up) {
        lookAt(me.value, eye, center, up);
        return me;
      },
      rotate(m, rad, axis) {
        rotate(me.value, m, rad, axis);
        return me;
      },
      rotateX(m, angle) {
        rotateX(me.value, m, angle);
        return me;
      },
      rotateY(m, angle) {
        rotateY(me.value, m, angle);
        return me;
      },
      scale(m, v) {
        scale(me.value, m, typeof v === 'number' ? [ v, v, v ] : v);
        return me;
      },
      set(
        m00, m01, m02, m03,
        m10, m11, m12, m13,
        m20, m21, m22, m23,
        m30, m31, m32, m33,
      ) {
        set$3(
          me.value,
          m00, m01, m02, m03,
          m10, m11, m12, m13,
          m20, m21, m22, m23,
          m30, m31, m32, m33,
        );
    
        return me;
      },
      toOrthogonal({left, right, bottom, top, near, far} = {}) {
        ortho(me.value, left, right, bottom, top, near, far);
        return me;
      },
      toPerspective({fov, aspect, near, far} = {}) {
        perspective(me.value, fov, aspect, near, far);
        return me;
      },
      transpose(a) {
        set$3(me.value, a);
        return me;
      },
      translate(m, v) {
        translate(me.value, m, v);
        return me;
      },
    };
  };

  const flatten = x => x.map ? [].concat(...x.map(flatten)) : x;

  const identity = x => x;
  const noop = x => x;

  const is = Object.freeze({
    pow2: x => (x & (x - 1 )) == 0,
  });

  // a naive way to lazy load things
  const lazyfn = (payload) => _ => (payload);

  const pipe = (...fs) => arg => (
    fs.reduce((res, payloadfn) => (
      res.then(x => payloadfn(x, arg)), Promise.resolve(arg))
    )
  );

  const Box$1 = x => ({
    map: f => Box$1(f(x)),
    fold: f => f(x),
  });

  const Left = x => ({
    map: f => Left(x),
    fold: (f, g) => f(x),
  });

  const Right = x => ({
    map: f => Right(f(x)),
    fold: (f, g) => g(x),
  });

  function fromValues$2(x, y, z) {
    let out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }

  /**
   * Set the components of a vec3 to the given values
   *
   * @param {vec3} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} out
   */
  function set$2(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }

  const vec3fn = (x = 0, y = x, z = x) => ({
    value: fromValues$2(x, y, z),
    from(x = 0, y = x, z = x) {
      const value = set$2(this.value, x, y, z);
      return {...this, value};
    },
  });

  const renderable = () => ({
    matrix: mat4fn(),
    worldMatrix: mat4fn(),
    position: vec3fn(),
    rotation: vec3fn(),
    scale: vec3fn(1),
  });

  const camerafn = (params) => (
    Box$1(camera(params))
  );

  const camera = (
    {fov, aspect, near, far, left, right, bottom, top} = {}
  ) => ({
    ...renderable(),
    fov: fov || 45,
    aspect: aspect || 1,
    near: near || 1e-2,
    far: far || 1e4,
    left: left || null,
    right: right || null,
    bottom: bottom || 0,
    top: top || 0,
    isCamera: true,
    kind: (left || right) ? "orthogonal" : "perspective",
    modelViewMatrix: mat4fn(),
    normalMatrix: mat4fn(),
    projectionMatrix: mat4fn(),
    perspective(fov, aspect, near, far) {
      this.projectionMatrix.persp({fov, aspect, near, far});
      return Object.assign(this, {fov, aspect, near, far});
    },
    orthogonal(left, right, bottom, top, near, far) {
      this.projectionMatrix.orhto({left, right, bottom, top, near, far});
      return Object.assign(this, {left, right, bottom, top, near, far});
    },
  });

  const geometryfn = () => geometry();

  const geometry = () => ({
    attributes: {},
    faces: [],
    uvs: [],
    vertices: [],
  });

  const materialfn = (params) => () => (
    Box(material(params))
  );

  const material = ({color}) => ({
    color,
    isMaterial: true,
  });

  const meshfn = (geometry, material) => (
    Box$1(mesh({geometry, material}))
  );

  const mesh = ({geometry, material}) => ({
    ...renderable(),
    geometry,
    material,
  });

  /**
   * Creates a new vec2 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @returns {vec2} a new 2D vector
   */
  function fromValues$1(x, y) {
    let out = new ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
  }

  /**
   * Set the components of a vec2 to the given values
   *
   * @param {vec2} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @returns {vec2} out
   */
  function set$1(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
  }

  const vec2fn = (x = 0, y = x) => ({
    value: fromValues$1(x, y),
    from(x = 0, y = x) {
      const value = set$1(this.value, x, y);
      return {...this, value};
    },
  });

  const mousefn = (x, y, surface) => {
    mouse({x, y, surface});
  };

  const mouse = ({x, y, surface}) => ({
    AMORTIZATION: 0.95,
    THETA: 0,
    PHI: 0,
    drag: false,
    enable: false,
    surface,
    direction: vec2fn(),
    position: vec2fn(x, y),
    lastPosition: vec2fn(),
    onmousedown({pageX, pageY, preventDefault}) {
      this.drag = true;
      this.lastPosition.x = pageX;
      this.lastPosition.y = pageY;

      preventDefault();

      return false;
    },
    onmousemove({pageX, pageY, preventDefault}) {
      if (!this.drag) return false;

      if (this.enable) {
        this.direction.x =
          (pageX - this.lastPosition.x) * 2 * Math.PI / this.canvas.offsetWidth;

        this.direction.y =
          (pageY - this.lastPosition.y) * 2 * Math.PI / this.canvas.offsetHeight;

        this.THETA += this.direction.x;
        this.PHI += this.direction.y;
        this.lastPosition.x = pageX;
        this.lastPosition.y = pageY;
      }

      preventDefault();
    },
    onmouseup({preventDefault}) {
      this.drag = false;

      preventDefault();
    },
    render() {
      if (this.enable && !this.drag) {
        this.direction.x *= this.AMORTIZATION;
        this.direction.y *= this.AMORTIZATION;
        this.THETA += this.direction.x;
        this.PHI += this.direction.y;
      }
    },
  });

  var fsShader = "#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\nvarying vec4 vColor;varying highp vec3 vLighting;void main(){gl_FragColor=vec4(vColor.rgb*vLighting,vColor.a);}"; // eslint-disable-line

  var vsShader = "#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\nattribute vec4 color;attribute vec3 normal;attribute vec4 position;attribute vec2 texture2d;uniform mat4 modelViewMatrix;uniform mat4 normalMatrix;uniform mat4 object3dMatrix;uniform mat4 projectionMatrix;uniform vec2 resolution;varying vec4 vColor;varying vec3 vLighting;void main(){vec3 ambientLight=vec3(0.3,0.3,0.3);vec3 directionalLightColor=vec3(0.0,1.0,1.0);vec3 directionalVector=vec3(0.85,0.8,0.75);vec4 transformedNormal=normalMatrix*vec4(normal,1.0);float directional=max(dot(transformedNormal.xyz,directionalVector),0.5);vLighting=ambientLight+(directionalLightColor*directional);vColor=color;gl_Position=projectionMatrix*modelViewMatrix*object3dMatrix*vec4(position.xyz,1.0);}"; // eslint-disable-line

  let THETA = 0;
  let PHI = 0;

  const rendererfn = (params) => (
    Box$1(renderer(params))
  );

  const framefn = (scene, camera, payloadfn) => (
    cur => {
      cur.framefn = lazyfn({scene, camera, payloadfn});
      return cur;
    }
  );

  const renderer = ({
    alpha = false,
    antialias = true,
    autoClear = true,
    canvas = document.createElement('canvas'),
    width = 200,
    height = 200,
    dpr = window.devicePixelRatio,
  }) => ({
    dpr,
    width,
    height,
    gl: canvas.getContext('experimental-webgl', {
      alpha,
      antialias,
      failIfMajorPerformanceCaveat: true,
      powerPreference: 'default',
      preserveDrawingBuffer: false,
    }),
    program: {},
    canvas: canvas || document.createElement("canvas"),
    renderering: false,
    lostingContext: false,
    framefn: () => {},
    oncontextmenu({preventDefault}) {
      this.lostingContext = true;
      preventDefault();
    },
    oncontextrestore(_) {
      this.lostingContext = false;
      this.start();
    },
    resize() {
      this.setSize();
      this.clear();

      return this;
    },
    setSize({width = 200, height = 200} = {}) {
      this.canvas.width = width * this.dpr;
      this.canvas.height = height * this.dpr;

      this.setViewportSize();

      Object.assign(this.canvas.style, {
        width: `${width}px`,
        height: `${height}px`,
      });

      return this;
    },
    setViewportSize({width = 200, height = 200} = {}) {
      this.gl.viewport(0, 0, width, height);

      return this;
    },
    async start() {
      this.setup();
      this.frame();
      this.resize();
    },
    async setup() {
      this.program = mkprogram(this.gl);

      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL); 

      this.rendering = true;
      let t = performance.now();

      if (performance.now() - t > 10) {
        t = await this.nextFrame();
      }

      this.renderering = false;
    },
    async frame() {
      const {scene, camera, payloadfn} = this.framefn();

      do {
        payloadfn(this.render({scene, camera}));
        // console.log("1");
        await this.nextFrame();
      } while (this.rendering);
    },
    render({scene, camera}) {
      let object;

      if (this.lostingContext) return;

      for (let i = 0; i < scene.children.length; i++) {
        object = scene.children[i];

        if (object) {
          if (!object.positionBuf) object.positionBuf = this.gl.createBuffer();
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.positionBuf);
          
          this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(object.vertices),
            this.gl.STATIC_DRAW,
          );

          if (!object.__colorBuf) object.__colorBuf = this.gl.createBuffer();
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.__colorBuf);

          this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(object.colors),
            this.gl.STATIC_DRAW,
          );

          if (object.normals.length > 0) {
            if (!object.__normalBuf) object.__normalBuf = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.__normalBuf);

            this.gl.bufferData(
              this.gl.ARRAY_BUFFER,
              new Float32Array(object.normals),
              this.gl.STATIC_DRAW,
            );
          }

          if (!object.__indexBuf) object.__indexBuf = this.gl.createBuffer();
          this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, object.__indexBuf);

          this.gl.bufferData(
            this.gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(object.indices),
            this.gl.STATIC_DRAW,
          );

          this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, object.__indexBuf);

          this.matrices({object, camera});
    
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.positionBuf);

          this.gl.vertexAttribPointer(
            this.program.position, 3, this.gl.FLOAT, false, 0, 0,
          );

          this.gl.enableVertexAttribArray(this.program.position);
    
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.__colorBuf);

          this.gl.vertexAttribPointer(
            this.program.color, 4, this.gl.FLOAT, false, 0, 0,
          );

          this.gl.enableVertexAttribArray(this.program.color);
          
          if (object.normals.length > 0) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.__normalBuf);

            this.gl.vertexAttribPointer(
              this.program.normal, 3, this.gl.FLOAT,false, 0, 0
            );

            this.gl.enableVertexAttribArray(this.program.normal);
          }

          this.gl.uniformMatrix4fv(
            this.program.modelViewMatrix,
            false,
            camera.modelViewMatrix.value,
          );

          this.gl.uniformMatrix4fv(
            this.program.normalMatrix,
            false,
            camera.normalMatrix.value,
          );

          this.gl.uniformMatrix4fv(
            this.program.projectionMatrix,
            false,
            camera.projectionMatrix.value,
          );

          this.gl.uniformMatrix4fv(
            this.program.object3dMatrix,
            false,
            object.matrix.value,
          );

          this.gl.drawElements(
            this.gl.TRIANGLES,
            object.indices.length,
            this.gl.UNSIGNED_SHORT,
            0,
          );

          this.gl.flush();
        }
      }

      this.radian += Math.PI / 180;

      return this;
    },
    matrices({object, camera} = {}) {
      switch(camera.kind) {
        case "persp":
          camera.persp({
            fov: camera.fov,
            aspect: camera.aspect,
            near: camera.near,
            far: camera.far
          } );
          break;
        case "ortho":
          camera.ortho({
            left: camera.left,
            right: camera.right,
            bottom: camera.bottom,
            top: camera.top,
            near: camera.near,
            far: camera.far
          });
          break;
        default:
          return;
      }

      camera.modelViewMatrix.identity();
      
      camera.modelViewMatrix.translate(
        camera.modelViewMatrix.value,
        camera.position.value,
      );
      
      camera.modelViewMatrix.rotate(
        camera.modelViewMatrix.value,
        this.radian,
        camera.rotation.value,
      );

      object.matrix.identity();
      object.matrix.translate(object.matrix.value, object.position.value);
      object.matrix.rotateX(object.matrix.value, PHI);
      object.matrix.rotateY(object.matrix.value, THETA);
    },
    clear() {
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      this.gl.clearDepth(1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    },
    stop() {
      this.rendering = false;
    },
    nextFrame() {
      return new Promise(window.requestAnimationFrame);
    },
  });

  function mkshader({gl, kind, source}) {
    const shader = {
      fragment: gl.createShader(gl.FRAGMENT_SHADER),
      vertex: gl.createShader(gl.VERTEX_SHADER),
    };

    const s = shader[kind];

    gl.shaderSource(s, source);
    gl.compileShader(s);

    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(s));
      return null;
    }

    return s;
  }
  function mkprogram(gl) {
    const p = gl.createProgram();
    const vertex = mkshader({gl, kind: "vertex", source: vsShader});
    const fragment = mkshader({gl, kind: "fragment", source: fsShader});

    gl.attachShader(p, vertex);
    gl.attachShader(p, fragment);
    gl.linkProgram(p);

    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(p);
      console.log(`could not initialise shader program, ${log}`);
    }

    gl.useProgram(p);

    p.color = gl.getAttribLocation(p, 'color');
    p.normal = gl.getAttribLocation(p, 'normal');
    p.position = gl.getAttribLocation(p, 'position');

    p.modelViewMatrix = gl.getUniformLocation(p, 'modelViewMatrix');
    p.normalMatrix = gl.getUniformLocation(p, 'normalMatrix');
    p.object3dMatrix = gl.getUniformLocation(p, 'object3dMatrix');
    p.projectionMatrix = gl.getUniformLocation(p, 'projectionMatrix');
    p.uSampler = gl.getUniformLocation(p, 'uSampler');

    return p;
  }

  const scenefn = () => (scene());

  const scene = () => ({
    name: "",
    isScene: true,
    children: [],
    add(child) {
      const children = this.children.splice(this.children.length, 0, child);
      return Object.create(this, {children});
    },
  });

  const texturefn = () => texture();

  const texture = () => ({
    load({gl, src}) {
      const texture = gl.createTexture();
      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 1;
      const height = 1;
      const border = 0;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      const pixel = new Uint8Array([0, 0, 255, 255]);

      gl.bindTexture(gl.TEXTURE_2D, texture);
      
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel,
      );

      const image = new Image();

      image.onload = _ => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
    
        if (is.pow2(image.width) && is.pow2(image.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
      };

      image.src = src;

      return texture;
    },
  });

  const cubefn = ({color = [1.0, 0.5, 0.5, 0.0]} = {}) => {
    return {
      ...renderable(),
      baseColors: [],
      colors: [],
      matrix: mat4fn(),
      name: '',
      textures: [
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
      ],
      normals: [
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,

        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,

        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,

        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
      ],
      vertices: [ 
        -0.5, -0.5,  0.5,
        0.5, -0.5,  0.5,
        0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,

        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5,  0.5, -0.5,
        -0.5,  0.5, -0.5,

        0.5,  0.5,  0.5,
        -0.5, 0.5,  0.5,
        -0.5, 0.5, -0.5,
        0.5,  0.5, -0.5,

        -0.5, -0.5,  0.5,
        0.5,  -0.5,  0.5,
        0.5,  -0.5, -0.5,
        -0.5, -0.5, -0.5,

        0.5, -0.5,  0.5,
        0.5,  0.5,  0.5,
        0.5,  0.5, -0.5,
        0.5, -0.5, -0.5,

        -0.5, -0.5,  0.5,
        -0.5,  0.5,  0.5,
        -0.5,  0.5, -0.5,
        -0.5, -0.5, -0.5 
      ],
      indices: [
        0,  1,  2,  0,  2 , 3,
        4,  5,  6,  4,  6 , 7,
        8,  9, 10,  8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
      ],
    }
  };

  const planefn = ({name = "", width = 1, height = 1} = {}) => {
    const width_half = width / 2;
    const height_half = height / 2;

    return {
      ...renderable(),
      name,
      width,
      height,
      colors: [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 0.0, 1.0
      ],
      indices: [0, 1, 2, 1, 2, 3],
      normals: [],
      viewMatrix: mat4fn(),
      vertices: [
        vec3fn(-width_half,  height_half, 0).value,
        vec3fn(width_half,  height_half, 0).value,
        vec3fn(-width_half, -height_half, 0).value,
        vec3fn(width_half, -height_half, 0).value,
      ].flatMap(flatten),
    };
  };

  const trianglefn = _ => ({
    ...renderable(),
    colors: [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0],
    indices: [0, 1, 2],
    normals: [],
    positions: [0, 1, 0, 1, -1, 0, -1, -1, 0],
    vertices: [0,  1, 0, 1, -1, 0, -1, -1, 0],
  });

  const tetrahedronfn = _ => ({
    ...renderable(),
    colors: [
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      1.0, 1.0, 0.0, 1.0,
    ],
    matrix: mat4fn(),
    normals: [],
    indices: [
      0, 1, 2,
      0, 1, 3,
      1, 2, 3,
      0, 2, 3,
    ],
    vertices: [
      -1, -1, -1,  1, 0, 0,
       1, -1, -1,  0, 1, 0,
       0, -1,  1,  0, 0, 1,
       0,  1,  0,  1, 1, 1,
    ],
  });

  const colorfn = c => ({
    value: colorfn.parse(c),
    parse(color) {
      const hex = Math.floor(color);

      const c = [
        (hex >> 16 & 255) / 255,
        (hex >> 8 & 255) / 255,
        (hex & 255) / 255,
      ];

      return {...this, value: c};
    },
  });

  const posfn = ({x, y, z}) => ({
    x, y, z,
  });

  const posfrom = (x, y, z) => (cur) => {
    cur.position.from(x, y, z);
    return cur;
  };

  /**
   * Creates a new vec4 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {vec4} a new 4D vector
   */
  function fromValues(x, y, z, w) {
    let out = new ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }

  /**
   * Set the components of a vec4 to the given values
   *
   * @param {vec4} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {vec4} out
   */
  function set(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }

  const vec4fn = (x = 0, y = x, z = x, w = x) => ({
    value: fromValues(x, y, z, w),
    from(x = 0, y = x, z = x, w = x) {
      const value = set(this.value, x, y, z, w);
      return {...this, value};
    },
  });

  (async () => {

    const camera = camerafn({})
      .map(posfrom(0, 0, -8))
      .fold(noop);

    const scene = scenefn();
      
    const plane = planefn({width: 2, height: 2});
    scene.add(plane);
    
    const renderer = rendererfn({width: 500, height: 500})
      .map(framefn(scene, camera, () => {}))
      .fold(noop);

    document.body.appendChild(renderer.canvas);
    await renderer.start();
  })();

  exports.Box = Box$1;
  exports.Left = Left;
  exports.Right = Right;
  exports.camerafn = camerafn;
  exports.colorfn = colorfn;
  exports.cubefn = cubefn;
  exports.flatten = flatten;
  exports.framefn = framefn;
  exports.geometryfn = geometryfn;
  exports.identity = identity;
  exports.is = is;
  exports.lazyfn = lazyfn;
  exports.mat4fn = mat4fn;
  exports.materialfn = materialfn;
  exports.meshfn = meshfn;
  exports.mousefn = mousefn;
  exports.noop = noop;
  exports.pipe = pipe;
  exports.planefn = planefn;
  exports.posfn = posfn;
  exports.renderable = renderable;
  exports.rendererfn = rendererfn;
  exports.scenefn = scenefn;
  exports.tetrahedronfn = tetrahedronfn;
  exports.texturefn = texturefn;
  exports.trianglefn = trianglefn;
  exports.vec2fn = vec2fn;
  exports.vec3fn = vec3fn;
  exports.vec4fn = vec4fn;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
//# sourceMappingURL=xsthree.js.map
