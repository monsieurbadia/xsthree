import {mat4fn} from '../math/mat4';
import {vec3fn} from '../math/vec3';

export const renderable = () => ({
  matrix: mat4fn(),
  worldMatrix: mat4fn(),
  position: vec3fn(),
  rotation: vec3fn(),
  scale: vec3fn(1),
});
