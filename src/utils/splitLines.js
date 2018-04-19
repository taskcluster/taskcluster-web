import { uniq, pipe, map, filter, split } from 'ramda';

/**
 * Splits a string into an array of strings using newlines as a separator.
 * Returns an array with unique values.
 */
export default pipe(
  split(/[\r\n]+/),
  map(line => line.trim()),
  filter(Boolean),
  uniq
);
