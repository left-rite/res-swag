import * as Ajv from 'ajv';
import * as dereference from 'deref';
import * as md5 from 'md5';
import * as jsonPtr from 'json-ptr';
import { toJson, isTruthyJson } from './util/json';
import { banUnknownProperties, allowNullableProperties, allowNullableObjects, getProperties } from './util/properties';
import { JsonPointers } from './models/json-pointers.model';
import { defaultOptions, SwagOptions } from './swag.options';
import { Version } from './models/supported-versions.model';
import { Swagger2 } from './models/swagger-2.0.model';
import { OpenApi3 } from './models/openapi-3.0.model';
import { Swagger2Navigator } from './swagger/swagger-2';
import { OpenApi3Navigator } from './open-api/open-api-3';
import { mergeSubschemas } from './util/schema';
import { ErrorResponse as ErrorMessage } from './models/error-message.model';
import { isNullOrUndefined } from 'util';
import { ResponseData } from './models/response-data.model';
import { SchemaReference, ReferenceType } from './models/schema-reference.model';

export class Swag {
  
  public ajv: Ajv.Ajv;
  public options: SwagOptions;
  private swagger2: Swagger2Navigator;
  private openapi3: OpenApi3Navigator;

  constructor(private paths: JsonPointers, options?: Partial<SwagOptions>, ajvOptions?: Ajv.Options) {
    this.ajv = new Ajv(ajvOptions);
    this.swagger2 = new Swagger2Navigator();
    this.openapi3 = new OpenApi3Navigator();
    this.options = Object.assign({}, defaultOptions, options);
  }

  validate(definition: any, response: any, options?: Partial<SwagOptions>): boolean | PromiseLike<any> | ErrorMessage {
    const useCaseOptions = Object.assign({}, this.options, options);
    
    const { url, method, status, contentType, responseBody } = this.getRequiredData(response);
    
    const version = this.determineVersion(definition);
    
    let schemaReference: SchemaReference;

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
    

    if (schemaReference.type === ReferenceType.NoContent) {
      if (!responseBody) {
        return true;
      }

      const errorMessage = JSON.stringify({ url, responseBody, schema: schemaReference.pointer }, null, 4);
      throw new Error(`Expected an empty response body. ${errorMessage}`);
    }

    if (schemaReference.type === ReferenceType.JSON && !responseBody) {
      const errorMessage = JSON.stringify({ url, responseBody, schema: schemaReference.pointer }, null, 4);
      throw new Error(`Expected json response body. ${errorMessage}`);
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

    const responseJson = toJson(responseBody, false);
    const result = this.ajv.validate(key+schemaReference.pointer, responseJson);

    const errorMessage: ErrorMessage = {
      url,
      responseBody: responseJson, 
      schema: schemaReference.pointer, 
      errors: this.ajv.errors 
    };
    
    return result || errorMessage;
  }

  private determineVersion(definition: Swagger2 & OpenApi3): Version {
    if (!definition.swagger && !definition.openapi) {
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

  private getRequiredData(response: any): ResponseData {
    const url = jsonPtr.get(response, this.paths.url);
    const rawMethod = jsonPtr.get(response, this.paths.method);
    const status = jsonPtr.get(response, this.paths.status);
    const rawContentType = jsonPtr.get(response, this.paths.contentType) || [];
    const responseBody = jsonPtr.get(response, this.paths.responseBody) || null;

    const checkNullOrUndefined = (n, p) => { if (isNullOrUndefined(p)) { 
      throw new Error(`The ${n} did not have a value. Check the ${n} json pointer`); 
    }};

    checkNullOrUndefined('url', url);
    checkNullOrUndefined('method', rawMethod);
    checkNullOrUndefined('status', status);

    const method = rawMethod.toLowerCase();
    const contentType = Array.isArray(rawContentType) ? rawContentType : rawContentType.split(';').map(c => c.trim());

    return { 
      url, 
      method,
      status, 
      contentType, 
      responseBody
    };
  }

}
