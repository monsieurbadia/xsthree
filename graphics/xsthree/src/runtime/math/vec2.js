import * as vec2 from './wasmatrix/vec2';

export const vec2fn = (x = 0, y = x) => ({
  value: vec2.fromValues(x, y),
  from(x = 0, y = x) {
    const value = vec2.set(this.value, x, y);
    return {...this, value};
  },
});
