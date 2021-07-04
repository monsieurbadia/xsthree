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
  onmousedown(event) {
    this.drag = true;
    this.lastPosition.x = event.pageX;
    this.lastPosition.y = event.pageY;

    event.preventDefault();

    return false;
  },
  onmousemove(event) {
    if (!this.drag) return false;

    if (this.enable) {
      this.direction.x =
        (event.pageX - this.lastPosition.x) * 2 * Math.PI / this.canvas.offsetWidth;

      this.direction.y =
        (event.pageY - this.lastPosition.y) * 2 * Math.PI / this.canvas.offsetHeight;

      this.THETA += this.direction.x;
      this.PHI += this.direction.y;
      this.lastPosition.x = event.pageX;
      this.lastPosition.y = event.pageY;
    }

    event.preventDefault();
  },
  onmouseup(event) {
    this.drag = false;

    event.preventDefault();
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
