# xsthree

> *a pocket and functional 3d library*

I don't think this project is intended to be useful for anyone. It's just a way for me to have fun and test things.

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
