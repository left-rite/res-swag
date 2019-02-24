import { getProperties } from './properties';

export const mergeSubschemas = (schema: any): any => {
  if (typeof schema === 'object') {
    getProperties(schema).forEach(k => mergeSubschemas(schema[k]));

    if (schema.allOf && Array.isArray(schema.allOf)) {  
      const combined = schema.allOf.reduce((c, s) => {
        const properties = getProperties(s);
        properties.forEach(p => {
          if (Array.isArray(c[p])) {
            c[p].push(...s[p]);
          }
          else if (typeof c[p] === 'object') {
            c[p] = Object.assign({}, c[p], s[p]);
          }
          else {
            c[p] = s[p];
          }
          
        }); 
        return c;
      }, {});

      delete schema.allOf;
      schema = Object.assign(schema, combined);
    }

  }

  return schema;
};
