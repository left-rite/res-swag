import * as Ajv from 'ajv';
import * as dereference from 'deref';
import * as md5 from 'md5';
import { get } from './util/get';
import { toJson } from './util/json';
import { banUnknownProperties, allowNullableProperties, allowNullableObjects } from './util/properties';
import { JsonPaths } from './models/json-paths.model';
import { defaultOptions, SwagOptions } from './swag.options';
import { Version } from './models/supported-versions.model';
import { Swagger2 } from './models/swagger-2.0.model';
import { OpenApi3 } from './models/openapi-3.0.model';
import { Swagger2Navigator } from './swagger/swagger-2';
import { OpenApi3Navigator } from './open-api/open-api-3';
import { mergeSubschemas } from './util/schema';

export class Swag {
  
  public ajv: Ajv.Ajv;
  public options: SwagOptions;
  private swagger2: Swagger2Navigator;
  private openapi3: OpenApi3Navigator;

  constructor(private paths: JsonPaths, options?: Partial<SwagOptions>, ajvOptions?: Ajv.Options) {
    this.ajv = new Ajv(ajvOptions);
    this.swagger2 = new Swagger2Navigator();
    this.openapi3 = new OpenApi3Navigator();
    this.options = Object.assign({}, defaultOptions, options);
  }

  validate(definition: any, response: any, options?: Partial<SwagOptions>): boolean | Ajv.ErrorObject[] | PromiseLike<any> {
    const useCaseOptions = Object.assign({}, this.options, options);
    
    const url = get(response, this.paths.url);
    const method = get(response, this.paths.method);
    const status = get(response, this.paths.status);
    const contentType = get(response, this.paths.contentType);
    const responseBody = get(response, this.paths.responseBody);
    const responseJson = responseBody ? toJson(responseBody) : null;
    
    const version = this.determineVersion(definition);
    
    let schemaReference;

    switch (version.major) {
      case 2:
        schemaReference = this.swagger2.getSchemaReference(definition, url, method, status);
        break;
      case 3:
        schemaReference = this.openapi3.getSchemaReference(definition, url, method, status, contentType, useCaseOptions);
        break;
      default:
        throw new Error('Unknown Swagger/OpenAPI version, only v2 and v3 are supported');
    }

    const signature = JSON.stringify( { definition, options });
    const key = md5(signature);

    if (!this.ajv.getSchema(key)) {
      const clonedDefinition = JSON.parse(JSON.stringify(definition));
      const deferencedDefinition = dereference()(clonedDefinition, true);
  
      if (!definition.id) { 
        delete deferencedDefinition.id;
      }
    
      mergeSubschemas(deferencedDefinition);

      this.customiseDefinition(deferencedDefinition, useCaseOptions);
      this.ajv.addSchema(deferencedDefinition, key);
    }

    const result = this.ajv.validate(key+schemaReference, responseJson);
    
    return result || this.ajv.errors;
  }

  private determineVersion(definition: Swagger2 & OpenApi3): Version {
    if (!definition.swagger && !definition.definitions) {
      throw new Error('Could not determine if definition is a Swagger/OpenAPI specification');
    }

    const [major, minor, patch] = (definition.swagger || definition.openapi).split('.').map(v => Number(v));

    return { major, minor, patch };
  }

  private customiseDefinition(definition: any, options: SwagOptions): any {

    banUnknownProperties(options.banUnknownProperties, definition);

    allowNullableProperties(options.implicitNullableProperties, definition);

    allowNullableObjects(options.implicitNullableObjects, definition);
  }

}
