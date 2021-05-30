export const Left = x => ({
  map: f => Left(x),
  fold: (f, g) => f(x),
});
