import * as Ajv from 'ajv';

export interface ErrorResponse {
  url: string,
  responseBody: any,
  schema: string, 
  errors: Ajv.ErrorObject[],
}