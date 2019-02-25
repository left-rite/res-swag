export const defaultOptions: SwagOptions = {
  banUnknownProperties: true,
  implicitNullableProperties: true,
  implicitNullableObjects: true,
  ignoreUnknownServer: true,
}

export interface SwagOptions {
  banUnknownProperties: boolean,
  implicitNullableProperties: boolean,
  implicitNullableObjects: boolean,
  ignoreUnknownServer: boolean,
}

