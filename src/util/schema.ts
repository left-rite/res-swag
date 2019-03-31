import { getProperties } from './properties';

export const mergeSubschemas = (schema: any): any => {
  if (schema && typeof schema === 'object') {
    getProperties(schema).forEach(k => mergeSubschemas(schema[k]));

    if (schema.allOf && Array.isArray(schema.allOf)) {  
      const combined = schema.allOf.reduce(mergeProperties, {});

      delete schema.allOf;
      schema = mergeProperties(schema, combined);
    }

  }

  return schema;
};

export const mergeProperties = (target: any, source: any): any => {
  if (source) {
    getProperties(source).forEach(p => {
      if (Array.isArray(target[p])) {
        target[p].push(...source[p]);
      }
      else if (typeof target[p] === 'object') {
        target[p] = Object.assign({}, target[p], source[p]);
      }
      else {
        target[p] = source[p];
      }
    }); 
  }
  
  return target;
};
