export interface OpenApi3 {
  openapi: string,
  server?: Server,
  servers?: Server[],
  paths: Paths,
  definitions: any,
}

export interface Server {
  url: string,
  description: string,
  variables: Variables,
}

type Variables = any;

interface Paths {
  [path: string]: Method,
}

interface Method {
  post?: RequestResponse,
  get?: RequestResponse,
  put?: RequestResponse,
  patch?: RequestResponse,
  delete?: RequestResponse,
}

interface RequestResponse {
  parameters: Parameters[],
  responses: Responses,
}

interface Parameters {
  in: string,
  name: string,
  description?: string,
  required?: boolean,
  schema?: any,
}

interface Responses {
  [status: number]: Response,
}

interface Response {
  description?: string,
  headers?: any,
  content: Content,
}

interface Content {
  [mediaType: string]: Schema,
}

type Schema = any;
