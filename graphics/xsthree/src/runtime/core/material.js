export const materialfn = params => _ => (
  Box(material(params))
);

const material = ({color}) => ({
  color,
  isMaterial: true,
});
