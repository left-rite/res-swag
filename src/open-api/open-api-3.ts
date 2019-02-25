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

  getSchemaReference(openapi: OpenApi3, url: string, method: string, status: number, options: SwagOptions): string {
    const basePath = this.serverInfo.getBasePath(openapi, url, options.ignoreUnknownServer) || '';
    const paths = getProperties(openapi.paths);
    
    const match = paths.reduce((m, p) => toRegex(basePath + p).test(url) && (p && p.length) > (m && m.length) ? p : m , null);

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
      throw new Error (`The status ${status} did not match available statuses "${statuses.join(', ')}" in "${method} ${match}"`);
    }

    return `#/paths/${encodeJsonProperty(match)}/${method}/responses/${status}/content/application~1json/schema`;
  }

}
