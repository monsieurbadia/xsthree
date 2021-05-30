import {Box} from '../util';
import {renderable} from './renderable';

export const meshfn = (geometry, material) => (
  Box(mesh({geometry, material}))
);

const mesh = ({geometry, material}) => ({
  ...renderable(),
  geometry,
  material,
});
