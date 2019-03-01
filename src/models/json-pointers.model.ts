export type JsonPointer = string;

export interface JsonPointers {
  url: JsonPointer,
  method: JsonPointer,
  status: JsonPointer,
  contentType?: JsonPointer,
  responseBody: JsonPointer,
}
