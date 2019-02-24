export const get = (object: any, properties: string | string[]): any => {
  properties = (typeof properties === 'string') ? properties.split('.').filter(p => p !== '') : properties;
  
  return properties.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), object);
};
