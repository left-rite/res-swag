import { posix } from 'path';

export const toRegex = (input: string): RegExp => {
  const replaceValue = '([a-zA-Z0-9_-]+)';
  const searchValue = new RegExp('{[a-zA-Z0-9_-]+}', 'g');
  const termination = '(?!\/+.)';

  return new RegExp(
    posix.normalize(input)
      .replace(/\/$/, '')
      .replace(searchValue, replaceValue)
      .concat(termination)
  );
}
