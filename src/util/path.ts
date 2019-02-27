import { toRegex } from './regex';

export const findBestPath = (url: string, paths: string[], basePath: string = ''): string => {
  return paths.reduce((m, p) => toRegex(basePath + p).test(url) && isBetterPath(m, p) ? p : m, null);
}

export const isBetterPath = (standard: string, path: string): boolean => {
  return (path && path.match(/\//g).length) > (standard && standard.match(/\//g).length) || 
    (path && path.match(/\//g).length) === (standard && standard.match(/\//g).length) && 
    (path && path.match(/{/g).length) < (standard && standard.match(/{/g).length);
}