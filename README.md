# xsthree

> *a pocket and functional 3d library*

```js
import {
  camerafn, scenefn, rendererfn, framefn,
  planefn, noop, posfn,
} from "xsthree";

(async () => {
  const camera = camerafn({})
    .map(posfn(0, 0, -8))
    .fold(noop);

  const scene = scenefn();

  const plane = planefn({width: 2, height: 2});
  scene.add(plane);

  const renderer = rendererfn({width: 500, height: 500})
    .map(framefn(scene, camera, () => {}))
    .fold(noop);

  document.body.appendChild(renderer.canvas);
  await renderer.start();
})();
```
