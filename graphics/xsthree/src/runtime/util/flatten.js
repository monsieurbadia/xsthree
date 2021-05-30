export const flatten = x => x.map ? [].concat(...x.map(flatten)) : x;
