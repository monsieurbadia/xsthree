import fsShader from './glsl/shader.fs';
import vsShader from './glsl/shader.vs';
import {mousefn} from './mouse';
import {lazyfn, Box} from '../util';

let AMORTIZATION = 0.95;
let THETA = 0;
let PHI = 0;

export const rendererfn = (params) => (
  Box(renderer(params))
);

export const framefn = (scene, camera, payloadfn) => (
  cur => {
    cur.framefn = lazyfn({scene, camera, payloadfn});
    return cur;
  }
);

const renderer = ({
  alpha = false,
  antialias = true,
  autoClear = true,
  canvas = document.createElement('canvas'),
  width = 200,
  height = 200,
  dpr = window.devicePixelRatio,
}) => ({
  dpr,
  width,
  height,
  gl: canvas.getContext('experimental-webgl', {
    alpha,
    antialias,
    failIfMajorPerformanceCaveat: true,
    powerPreference: 'default',
    preserveDrawingBuffer: false,
  }),
  program: {},
  canvas: canvas || document.createElement("canvas"),
  renderering: false,
  lostingContext: false,
  framefn: () => {},
  oncontextmenu({preventDefault}) {
    this.lostingContext = true;
    preventDefault();
  },
  oncontextrestore(_) {
    this.lostingContext = false;
    this.start();
  },
  resize() {
    this.setSize();
    this.clear();

    return this;
  },
  setSize({width = 200, height = 200} = {}) {
    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;

    this.setViewportSize();

    Object.assign(this.canvas.style, {
      width: `${width}px`,
      height: `${height}px`,
    });

    return this;
  },
  setViewportSize({width = 200, height = 200} = {}) {
    this.gl.viewport(0, 0, width, height);

    return this;
  },
  async start() {
    this.setup();
    this.frame();
    this.resize();
  },
  async setup() {
    this.program = mkprogram(this.gl);

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL); 

    this.rendering = true;
    let t = performance.now();

    if (performance.now() - t > 10) {
      t = await this.nextFrame();
    }

    this.renderering = false;
  },
  async frame() {
    const {scene, camera, payloadfn} = this.framefn();

    do {
      payloadfn(this.render({scene, camera}));
      // console.log("1");
      await this.nextFrame();
    } while (this.rendering);
  },
  render({scene, camera}) {
    let object;

    if (this.lostingContext) return;

    for (let i = 0; i < scene.children.length; i++) {
      object = scene.children[i];

      if (object) {
        if (!object.positionBuf) object.positionBuf = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.positionBuf);
        
        this.gl.bufferData(
          this.gl.ARRAY_BUFFER,
          new Float32Array(object.vertices),
          this.gl.STATIC_DRAW,
        );

        if (!object.__colorBuf) object.__colorBuf = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.__colorBuf);

        this.gl.bufferData(
          this.gl.ARRAY_BUFFER,
          new Float32Array(object.colors),
          this.gl.STATIC_DRAW,
        );

        if (object.normals.length > 0) {
          if (!object.__normalBuf) object.__normalBuf = this.gl.createBuffer();
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.__normalBuf);

          this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(object.normals),
            this.gl.STATIC_DRAW,
          );
        }

        if (!object.__indexBuf) object.__indexBuf = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, object.__indexBuf);

        this.gl.bufferData(
          this.gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(object.indices),
          this.gl.STATIC_DRAW,
        );

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, object.__indexBuf);
        this.matrices({object, camera});
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.positionBuf);

        this.gl.vertexAttribPointer(
          this.program.position, 3, this.gl.FLOAT, false, 0, 0,
        );

        this.gl.enableVertexAttribArray(this.program.position);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.__colorBuf);

        this.gl.vertexAttribPointer(
          this.program.color, 4, this.gl.FLOAT, false, 0, 0,
        );

        this.gl.enableVertexAttribArray(this.program.color);
        
        if (object.normals.length > 0) {
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.__normalBuf);

          this.gl.vertexAttribPointer(
            this.program.normal, 3, this.gl.FLOAT,false, 0, 0
          );

          this.gl.enableVertexAttribArray(this.program.normal);
        }

        this.gl.uniformMatrix4fv(
          this.program.modelViewMatrix,
          false,
          camera.modelViewMatrix.value,
        );

        this.gl.uniformMatrix4fv(
          this.program.normalMatrix,
          false,
          camera.normalMatrix.value,
        );

        this.gl.uniformMatrix4fv(
          this.program.projectionMatrix,
          false,
          camera.projectionMatrix.value,
        );

        this.gl.uniformMatrix4fv(
          this.program.object3dMatrix,
          false,
          object.matrix.value,
        );

        this.gl.drawElements(
          this.gl.TRIANGLES,
          object.indices.length,
          this.gl.UNSIGNED_SHORT,
          0,
        );

        this.gl.flush();
      }
    }

    this.radian += Math.PI / 180;

    return this;
  },
  matrices({object, camera} = {}) {
    switch(camera.kind) {
      case "persp":
        camera.persp({
          fov: camera.fov,
          aspect: camera.aspect,
          near: camera.near,
          far: camera.far
        } );
        break;
      case "ortho":
        camera.ortho({
          left: camera.left,
          right: camera.right,
          bottom: camera.bottom,
          top: camera.top,
          near: camera.near,
          far: camera.far
        });
        break;
      default:
        return;
    }

    camera.modelViewMatrix.identity();
    
    camera.modelViewMatrix.translate(
      camera.modelViewMatrix.value,
      camera.position.value,
    );
    
    camera.modelViewMatrix.rotate(
      camera.modelViewMatrix.value,
      this.radian,
      camera.rotation.value,
    );

    object.matrix.identity();
    object.matrix.translate(object.matrix.value, object.position.value);
    object.matrix.rotateX(object.matrix.value, PHI);
    object.matrix.rotateY(object.matrix.value, THETA);
  },
  clear() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  },
  stop() {
    this.rendering = false;
  },
  nextFrame() {
    return new Promise(window.requestAnimationFrame);
  },
});

function mkshader({gl, kind, source}) {
  const shader = {
    fragment: gl.createShader(gl.FRAGMENT_SHADER),
    vertex: gl.createShader(gl.VERTEX_SHADER),
  };

  const s = shader[kind];

  gl.shaderSource(s, source);
  gl.compileShader(s);

  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(s));
    return null;
  }

  return s;
};

function mkprogram(gl) {
  const p = gl.createProgram();
  const vertex = mkshader({gl, kind: "vertex", source: vsShader});
  const fragment = mkshader({gl, kind: "fragment", source: fsShader});

  gl.attachShader(p, vertex);
  gl.attachShader(p, fragment);
  gl.linkProgram(p);

  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p);
    console.log(`could not initialise shader program, ${log}`);
  }

  gl.useProgram(p);

  p.color = gl.getAttribLocation(p, 'color');
  p.normal = gl.getAttribLocation(p, 'normal');
  p.position = gl.getAttribLocation(p, 'position');

  p.modelViewMatrix = gl.getUniformLocation(p, 'modelViewMatrix');
  p.normalMatrix = gl.getUniformLocation(p, 'normalMatrix');
  p.object3dMatrix = gl.getUniformLocation(p, 'object3dMatrix');
  p.projectionMatrix = gl.getUniformLocation(p, 'projectionMatrix');
  p.uSampler = gl.getUniformLocation(p, 'uSampler');

  return p;
}
