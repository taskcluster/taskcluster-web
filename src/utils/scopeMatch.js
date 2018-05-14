import {
  T,
  F,
  equals,
  cond,
  dropLast,
  pipe,
  identity,
  test,
  not,
  compose,
} from 'ramda';
import { SCOPES_SEARCH_MODE } from './constants';

/**
 * A match function targeted on scopes.
 *
 * scopeMatch :: String mode -> String selectedScope ->
 *  (String scope -> Boolean isMatch)
 * */
const scopeMatch = (mode, selectedScope) => {
  const exact = equals(selectedScope);
  const hasScope = cond([
    [exact, T],
    [
      test(/\\*$/),
      pipe(dropLast(1), scope => selectedScope.indexOf(scope), equals(0)),
    ],
    [T, F],
  ]);

  return cond([
    [() => equals(mode, SCOPES_SEARCH_MODE.EXACT), exact],
    [() => equals(mode, SCOPES_SEARCH_MODE.HAS_SCOPE), hasScope],
    [
      () => equals(mode, SCOPES_SEARCH_MODE.HAS_SUB_SCOPE),
      () => {
        const pattern = cond([
          [compose(not, test(/\\*$/)), pattern => `${pattern}*`],
          [T, identity],
        ])(selectedScope);

        return cond([
          [equals(pattern), T],
          [T, scope => scope.indexOf(dropLast(1, pattern)), equals(0)],
        ]);
      },
    ],
    [T, T],
  ]);
};

export default scopeMatch;
