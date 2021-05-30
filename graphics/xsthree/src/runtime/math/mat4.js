import * as mat4 from './wasmatrix/mat4';

export const mat4fn = () => {
  const me = {
    value: mat4.create(),
  };

  return {
    ...me,
    identity () {
      mat4.identity(me.value);
      return me;
    },
    invert(a) {
      mat4.invert(me.value, a);
      return me;
    },
    lookAt(eye, center, up) {
      mat4.lookAt(me.value, eye, center, up);
      return me;
    },
    rotate(m, rad, axis) {
      mat4.rotate(me.value, m, rad, axis);
      return me;
    },
    rotateX(m, angle) {
      mat4.rotateX(me.value, m, angle);
      return me;
    },
    rotateY(m, angle) {
      mat4.rotateY(me.value, m, angle);
      return me;
    },
    scale(m, v) {
      mat4.scale(me.value, m, typeof v === 'number' ? [ v, v, v ] : v);
      return me;
    },
    set(
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33,
    ) {
      mat4.set(
        me.value,
        m00, m01, m02, m03,
        m10, m11, m12, m13,
        m20, m21, m22, m23,
        m30, m31, m32, m33,
      );
  
      return me;
    },
    toOrthogonal({left, right, bottom, top, near, far} = {}) {
      mat4.ortho(me.value, left, right, bottom, top, near, far);
      return me;
    },
    toPerspective({fov, aspect, near, far} = {}) {
      mat4.perspective(me.value, fov, aspect, near, far);
      return me;
    },
    transpose(a) {
      mat4.set(me.value, a);
      return me;
    },
    translate(m, v) {
      mat4.translate(me.value, m, v);
      return me;
    },
  };
};
