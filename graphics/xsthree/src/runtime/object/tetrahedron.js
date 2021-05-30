import {renderable} from '../core/renderable';
import {mat4fn} from '../math/mat4';

export const tetrahedronfn = _ => ({
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
