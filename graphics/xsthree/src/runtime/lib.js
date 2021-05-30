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
    
  const plane = planefn({width: 2, height: 2});
  scene.add(plane);
  
  const renderer = rendererfn({width: 500, height: 500})
    .map(framefn(scene, camera, () => {}))
    .fold(noop);

  document.body.appendChild(renderer.canvas);
  await renderer.start();
})();

// We only need `startup` here which is the main entry point
// In theory, we could also use all other functions/struct types from Rust which we have bound with
// `#[wasm_bindgen]`
const {startup} = wasm_bindgen;

async function run_wasm() {
    // Load the wasm file by awaiting the Promise returned by `wasm_bindgen`
    // `wasm_bindgen` was imported in `index.html`
    await wasm_bindgen('./pkg/wasm_in_web_worker_bg.wasm');

    console.log('index.js loaded');

    // Run main WASM entry point
    // This will create a worker from within our Rust code compiled to WASM
    startup();
}

run_wasm();