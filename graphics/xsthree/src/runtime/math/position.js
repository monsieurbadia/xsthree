export const posfn = ({x, y, z}) => ({
  x, y, z,
});

export const posfrom = (x, y, z) => (cur) => {
  cur.position.from(x, y, z);
  return cur;
};
