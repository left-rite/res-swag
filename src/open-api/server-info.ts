import { get } from '../util/get';
import { OpenApi3, Server } from '../models/openapi-3.0.model';
import * as Url from 'url-parse';
import { lcsRight } from '../util/lcs';

export class ServerInfoNavigator {

  getBasePath(openapi: OpenApi3, url: string, ignoreUnknownServer: boolean): string {
    const server = this.getServerDefinition(openapi, url, ignoreUnknownServer);
    
    if (server) {
      const basePath = get(server, 'variables.basePath.default');

      return basePath || new Url(server.url).pathname;
    }

    return this.guessBasePath(openapi);
  }

  private getServers(openapi: OpenApi3): Server[] {
    
    if (openapi.server) {
      return [openapi.server];
    }
    
    const servers = openapi.servers;
    
    if (!Array.isArray(servers)) {
      throw new Error('The OpenAPI definition\'s servers object is incorrect');
    }

    return servers;
  }

  private getServerDefinition(openapi: OpenApi3, url: string, ignoreUnknownServer: boolean): Server {
    const servers = this.getServers(openapi);
    
    if (!servers.length) {
      return null;
    }

    const matches = servers.filter(s => url.includes(s.url.replace(/\/$/, '')));
    
    if (matches.length === 0 && !ignoreUnknownServer) {
      throw new Error(`The url "${url}" did not match any of the available servers url "${matches.map((m, i) => `[${i}] ${m.url}`).join(', ')}"`);
    }

    if (matches.length > 1) {
      throw new Error(`The url "${url}" matches multiple servers url "${matches.map((m, i) => `[${i}] ${m.url}`).join(', ')}"`);
    }

    return matches[0];
  }

  private guessBasePath(openapi: OpenApi3): string {
    const servers = this.getServers(openapi);

    const firstSetOfClues = servers.map(s => s.variables && s.variables.basePath)
      .filter(b => !!b)
      .map(b => b.default.replace(/\/$/, ''));

    if (firstSetOfClues.length) {
      const firstGuess = firstSetOfClues.reduce(lcsRight);

      if (firstGuess) {
        return firstGuess;
      }
    }

    const secondSetOfClues = servers.map(s => s.url)
      .map(u => new Url(u).pathname.replace(/\/$/, ''))
      
    if (secondSetOfClues.length) {
      return secondSetOfClues.reduce(lcsRight);
    }

    return '';
  }

}