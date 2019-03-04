export interface SchemaReference {
  type: ReferenceType,
  pointer: string,
}

export enum ReferenceType {
  NoContent,
  JSON,
}