export const colorfn = c => ({
  value: colorfn.parse(c),
  parse(color) {
    const hex = Math.floor(color);

    const c = [
      (hex >> 16 & 255) / 255,
      (hex >> 8 & 255) / 255,
      (hex & 255) / 255,
    ];

    return {...this, value: c};
  },
  RGBToHSL(red, green, blue) {
    const bit = 255;
    // const r = [red / bit];
    const r = red / bit;
    const g = green / bit;
    const b = blue / bit;
  
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
  
    const hue = calculateHue(r, g, b, max, delta);
    const luminance = calculateLuminance(min, max);
    const saturation = calculateSaturation(delta, luminance);
  
    return {
      h: hue,
      s: saturation * 100,
      l: luminance * 100
    };
  }
});
