export type SupportedVersions = 'openapi 3.0' | 'openapi 2.0' | 'swagger 2.0';

export interface Version {
  major: number,
  minor: number,
  patch: number,
}
