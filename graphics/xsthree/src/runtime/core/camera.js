import {mat4fn} from '../math/mat4';
import {Box} from '../util';
import {renderable} from './renderable';

export const camerafn = (params) => (
  Box(camera(params))
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
