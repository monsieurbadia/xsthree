export const Right = x => ({
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
});
