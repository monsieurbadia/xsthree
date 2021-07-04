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
});
