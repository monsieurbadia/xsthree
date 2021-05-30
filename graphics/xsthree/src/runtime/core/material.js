export const materialfn = params => () => (
  Box(material(params))
);

const material = ({color}) => ({
  color,
  isMaterial: true,
});
