import * as vec3 from './wasmatrix/vec3';

export const vec3fn = (x = 0, y = x, z = x) => ({
  value: vec3.fromValues(x, y, z),
  from(x = 0, y = x, z = x) {
    const value = vec3.set(this.value, x, y, z);
    return {...this, value};
  },
});
