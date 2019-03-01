export interface ResponseData {
  url: string,
  method: string,
  status: number,
  contentType: string | string[],
  responseBody: any,
}