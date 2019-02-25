import * as Ajv from 'ajv';

export interface ErrorResponse {
  responseBody: any,
  schema: string, 
  errors: Ajv.ErrorObject[],
}