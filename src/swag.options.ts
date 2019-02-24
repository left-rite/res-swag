export const defaultOptions: SwagOptions = {
  banUnknownProperties: true,
  allowNullableProperties: true,
  allowNullableObjects: true,
  ignoreUnknownServer: true,
}

export interface SwagOptions {
  banUnknownProperties: boolean,
  allowNullableProperties: boolean,
  allowNullableObjects: boolean,
  ignoreUnknownServer: boolean,
}

