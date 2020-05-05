export const pipe = (...fns) => value =>
  fns.reduce((previousValue, fn) =>
    fn(previousValue), value);