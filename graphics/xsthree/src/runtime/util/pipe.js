export const pipe = (...fs) => arg => (
  fs.reduce((res, payloadfn) => (
    res.then(x => payloadfn(x, arg)), Promise.resolve(arg))
  )
);
