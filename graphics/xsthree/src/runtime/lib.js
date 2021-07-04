export * from './core';
export * from './object';
export * from './core';
export * from './math';
export * from './util';

// demo

import { camerafn } from './core/camera';
import { scenefn } from './core/scene';
import { planefn } from './object/plane';
import { posfrom } from './math/position';
import { noop } from './util';
import { framefn, rendererfn } from './core/renderer';

(async () => {
  "use strict";

  const camera = camerafn({})
    .map(posfrom(0, 0, -8))
    .fold(noop);

  const scene = scenefn();
    
  const plane = planefn({width: 3, height: 2});
  scene.add(plane);
  
  const renderer = rendererfn({width: 600, height: 600})
    .map(framefn(scene, camera, () => {}))
    .fold(noop);

  document.body.appendChild(renderer.canvas);
  await renderer.start();
})();
