import {renderable} from '../core/renderable';

export const trianglefn = _ => ({
  ...renderable(),
  colors: [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0],
  indices: [0, 1, 2],
  normals: [],
  positions: [0, 1, 0, 1, -1, 0, -1, -1, 0],
  vertices: [0,  1, 0, 1, -1, 0, -1, -1, 0],
});
