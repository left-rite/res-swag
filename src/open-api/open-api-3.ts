import { toRegex } from '../util/regex';
import { encodeJsonProperty } from '../util/json';
import { OpenApi3 } from '../models/openapi-3.0.model';
import { ServerInfoNavigator } from './server-info';
import { SwagOptions } from '../swag.options';

export class OpenApi3Navigator {

  private serverInfo: ServerInfoNavigator;

  constructor() {
    this.serverInfo = new ServerInfoNavigator;
  }

  getSchemaReference(openapi: OpenApi3, url: string, method: string, status: number, options: SwagOptions): string {
    const basePath = this.serverInfo.getBasePath(openapi, url, options.ignoreUnknownServer) || '';
    const paths = Object.keys(openapi.paths).filter(p => openapi.paths.hasOwnProperty(p));
    
    const match = paths.reduce((m, p) => toRegex(basePath + p).test(url) && (p && p.length) > (m && m.length) ? p : m , null);

    if (!match) {
      throw new Error(`The url "${url}" did not match available basePath "${basePath}" and paths "${paths.join(', ')}"`);
    }

    const path = openapi.paths[match];

    const methods = Object.keys(path).filter(m => path.hasOwnProperty(m));

    if (!methods.includes(method)) {
      throw new Error(`The method "${method}" did not match available methods "${methods.join(', ')}" for "${match}"`);
    }

    const statuses = Object.keys(path[method].responses).filter(m => path[method].responses.hasOwnProperty(m));

    if (!statuses.includes(status.toString())) {
      throw new Error (`The status ${status} did not match available statuses "${statuses.join(', ')}" in "${method} ${match}"`);
    }

    return `#/paths/${encodeJsonProperty(match)}/${method}/responses/${status}/content/application~1json/schema`;
  }

}
