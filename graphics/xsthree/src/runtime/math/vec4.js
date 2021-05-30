import * as vec4 from './wasmatrix/vec4';

export const vec4fn = (x = 0, y = x, z = x, w = x) => ({
  value: vec4.fromValues(x, y, z, w),
  from(x = 0, y = x, z = x, w = x) {
    const value = vec4.set(this.value, x, y, z, w);
    return {...this, value};
  },
});
