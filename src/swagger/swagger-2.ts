import { encodeJsonProperty } from '../util/json';
import { Swagger2 } from '../models/swagger-2.0.model';
import { findBestPath } from '../util/path';
import { getProperties } from '../util/properties';
import { SchemaReference, ReferenceType } from '../models/schema-reference.model';

export class Swagger2Navigator {

  getSchemaReference(swagger: Swagger2, url: string, method: string, status: number): SchemaReference {
    const basePath = swagger.basePath || '';
    const paths = getProperties(swagger.paths);
    
    const match = findBestPath(url, paths, basePath);

    if (!match) {
      throw new Error(`The url "${url}" did not match available basePath "${basePath}" and paths "${paths.join(', ')}"`);
    }

    const path = swagger.paths[match];

    const methods = getProperties(path);

    if (!methods.includes(method)) {
      throw new Error(`The method "${method}" did not match available methods "${methods.join(', ')}" for "${match}"`);
    }

    const statuses = getProperties(path[method].responses);

    if (!statuses.includes(status.toString())) {
      throw new Error (`The status ${status} did not match available statuses "${statuses.join(', ')}" in "${method} ${match}"`);
    }

    if (!path[method].responses[status].schema) {
      return {
        type: ReferenceType.NoContent,
        pointer: `#/paths/${encodeJsonProperty(match)}/${method}/responses/${status}`,
      }; 
    }

    return {
      type: ReferenceType.JSON,
      pointer: `#/paths/${encodeJsonProperty(match)}/${method}/responses/${status}/schema`,
    };
    
  }

}
