import {renderable} from '../core/renderable';
import {mat4fn} from '../math/mat4';
import {vec3fn} from '../math/vec3';
import {flatten} from '../util/flatten';

export const planefn = ({name = "", width = 1, height = 1} = {}) => {
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
