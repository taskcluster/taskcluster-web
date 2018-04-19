import { compareDesc } from 'date-fns';
import { or } from 'ramda';

/* eslint-disable import/prefer-default-export */

/**
 * Return A negative number if the reference element occurs before
 * the compare element; positive if the reference element occurs
 * after the compare element; 0 if they are equivalent.
 */
export const sort = (referenceElement, compareElement) => {
  if (
    typeof referenceElement === 'number' &&
    typeof compareElement === 'number'
  ) {
    const diff = referenceElement - compareElement;

    if (diff === 0) {
      return 0;
    }

    return diff < 0 ? -1 : 1;
  } else if (Date.parse(referenceElement) || Date.parse(compareElement)) {
    return compareDesc(referenceElement, compareElement);
  }

  return or(referenceElement, '').localeCompare(compareElement);
};
