import { get } from '../util/get';
import { OpenApi3, Server } from '../models/openapi-3.0.model';

export class ServerInfoNavigator {

  getBasePath(openapi: OpenApi3, url: string, ignoreUnknownServer: boolean): string {
    const server = this.getServerDefinition(openapi, url, ignoreUnknownServer);
    
    return get(server, 'variables.basePath');
  }

  private getServerDefinition(openapi: OpenApi3, url: string, ignoreUnknownServer: boolean): Server {
    if (openapi.server) {
      return openapi.server;
    }

    const servers = openapi.servers;
    
    if (!servers.length) {
      return null;
    }

    const matches = servers.filter(s => url.includes(s.url));
    
    if (matches.length === 0 && !ignoreUnknownServer) {
      throw new Error(`The url "${url} did not match any of the available servers url "${matches.map((m, i) => `[${i}] ${m.url}`).join(', ')}"`);
    }

    if (matches.length > 1) {
      throw new Error(`The url "${url} matches multiple servers url "${matches.map((m, i) => `[${i}] ${m.url}`).join(', ')}"`);
    }

    return get(matches, `0.variables.basePath`);
  }

}