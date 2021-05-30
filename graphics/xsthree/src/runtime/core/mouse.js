import {vec2fn} from '../math/vec2';

export const mousefn = (x, y, surface) => {
  mouse({x, y, surface})
};

const mouse = ({x, y, surface}) => ({
  AMORTIZATION: 0.95,
  THETA: 0,
  PHI: 0,
  drag: false,
  enable: false,
  surface,
  direction: vec2fn(),
  position: vec2fn(x, y),
  lastPosition: vec2fn(),
  onmousedown({pageX, pageY, preventDefault}) {
    this.drag = true;
    this.lastPosition.x = pageX;
    this.lastPosition.y = pageY;

    preventDefault();

    return false;
  },
  onmousemove({pageX, pageY, preventDefault}) {
    if (!this.drag) return false;

    if (this.enable) {
      this.direction.x =
        (pageX - this.lastPosition.x) * 2 * Math.PI / this.canvas.offsetWidth;

      this.direction.y =
        (pageY - this.lastPosition.y) * 2 * Math.PI / this.canvas.offsetHeight;

      this.THETA += this.direction.x;
      this.PHI += this.direction.y;
      this.lastPosition.x = pageX;
      this.lastPosition.y = pageY;
    }

    preventDefault();
  },
  onmouseup({preventDefault}) {
    this.drag = false;

    preventDefault();
  },
  render() {
    if (this.enable && !this.drag) {
      this.direction.x *= this.AMORTIZATION;
      this.direction.y *= this.AMORTIZATION;
      this.THETA += this.direction.x;
      this.PHI += this.direction.y;
    }
  },
});
