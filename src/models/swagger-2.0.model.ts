export interface Swagger2 {
  swagger: string,
  basePath: string,
  paths: Paths,
  definitions: any,
}

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
  schema: any,
}