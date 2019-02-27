import { toRegex } from './regex';

export const findBestPath = (url: string, paths: string[], basePath: string = ''): string => {
  return paths.reduce((m, p) => toRegex(basePath + p).test(url) && isBetterPath(m, p) ? p : m, null);
}

export const isBetterPath = (standard: string, contender: string): boolean => {
  if (!contender) return false;
  if (!standard) return true;
  
  const cPath = contender.match(/\//g);
  const sPath = standard.match(/\//g);

  if (!cPath) return false;
  if (!sPath) return true;
  
  if (cPath.length > sPath.length) return true;

  if (cPath.length === sPath.length) {
    const cVariables = contender.match(/{/g);
    const sVariables = standard.match(/{/g);
    
    return (cVariables ? cVariables.length : 0) < (sVariables ? sVariables.length : 0);
  }

  return false;
}