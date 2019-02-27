import { toRegex } from '../util/regex';
import { encodeJsonProperty } from '../util/json';
import { Swagger2 } from '../models/swagger-2.0.model';

export class Swagger2Navigator {

  getSchemaReference(swagger: Swagger2, url: string, method: string, status: number): string {
    const basePath = swagger.basePath || '';
    const paths = Object.keys(swagger.paths).filter(p => swagger.paths.hasOwnProperty(p));
    
    const match = paths.reduce((m, p) =>
      toRegex(basePath + p).test(url) && 
      (
        (p && p.match(/\//g).length) > (m && m.match(/\//g).length) || 
        (p && p.match(/\//g).length) === (m && m.match(/\//g).length) && 
        (p && p.match(/{/g).length) < (m && m.match(/{/g).length)
      )
        ? p 
        : m 
    , null);

    if (!match) {
      throw new Error(`The url "${url}" did not match available basePath "${basePath}" and paths "${paths.join(', ')}"`);
    }

    const path = swagger.paths[match];

    const methods = Object.keys(path).filter(m => path.hasOwnProperty(m));

    if (!methods.includes(method)) {
      throw new Error(`The method "${method}" did not match available methods "${methods.join(', ')}" for "${match}"`);
    }

    const statuses = Object.keys(path[method].responses).filter(m => path[method].responses.hasOwnProperty(m));

    if (!statuses.includes(status.toString())) {
      throw new Error (`The status ${status} did not match available statuses "${statuses.join(', ')}" in "${method} ${match}"`);
    }

    return `#/paths/${encodeJsonProperty(match)}/${method}/responses/${status}/schema`;
  }

}
