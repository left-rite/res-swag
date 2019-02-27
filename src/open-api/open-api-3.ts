import { toRegex } from '../util/regex';
import { encodeJsonProperty } from '../util/json';
import { OpenApi3 } from '../models/openapi-3.0.model';
import { ServerInfoNavigator } from './server-info';
import { SwagOptions } from '../swag.options';
import { getProperties } from '../util/properties';

export class OpenApi3Navigator {

  private serverInfo: ServerInfoNavigator;

  constructor() {
    this.serverInfo = new ServerInfoNavigator;
  }

  getSchemaReference(openapi: OpenApi3, url: string, method: string, status: number, contentType: string | string[], options: SwagOptions): string {
    const basePath = this.serverInfo.getBasePath(openapi, url, options.ignoreUnknownServer) || '';
    const paths = getProperties(openapi.paths);
    
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

    const path = openapi.paths[match];

    const methods = getProperties(path);

    if (!methods.includes(method)) {
      throw new Error(`The method "${method}" did not match available methods "${methods.join(', ')}" for "${match}"`);
    }

    const statuses = getProperties(path[method].responses);

    if (!statuses.includes(status.toString())) {
      throw new Error(`The status ${status} did not match available statuses "${statuses.join(', ')}" in "${method} ${match}"`);
    }

    const responseContentType = Array.isArray(contentType) ? contentType : contentType.split(';').map(c => c.trim());
    const availableContentType = getProperties(path[method].responses[status].content);
    
    const types = responseContentType.filter(r => availableContentType.includes(r));

    if (types.length !== 1) {
      const actual = responseContentType.join('; ');
      const expected = availableContentType.join('; ');
      const scenario = types.length === 0 ? 'did not match any of the available' : 'matched more than 1 of the available';
      throw new Error(`The content-type "${actual}" ${scenario} content-types "${expected}" in "${method} ${match} ${status}"`);
    }

    const type = types[0];

    return `#/paths/${encodeJsonProperty(match)}/${method}/responses/${status}/content/${encodeJsonProperty(type)}/schema`;
  }

}
