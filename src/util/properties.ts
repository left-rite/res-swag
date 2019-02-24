import { isNullOrUndefined } from 'util';

export const banUnknownProperties = (ban: boolean, object: any): any => {
  if (ban && typeof object === 'object') {
    Object.keys(object).filter(k => object.hasOwnProperty(k))
      .forEach(k => banUnknownProperties(ban, object[k]));

    if (object.type === 'object' && isNullOrUndefined(object.additionalProperties)) {
      object.additionalProperties = false;
    }
  }
  
  return object;
};

export const allowNullable = (allow: boolean, object: any, rule: (obj: any) => boolean): any => {
  if (allow && typeof object === 'object') {
    Object.keys(object).filter(k => object.hasOwnProperty(k))
      .forEach(k => allowNullable(allow, object[k], rule));

    if (object.type && rule(object)) {
      if (Array.isArray(object.type) && !object.type.includes('null')) { 
        object.type.push('null');
      }
  
      if (!Array.isArray(object.type) && object.type !== 'null') {
        object.type = [ object.type, 'null' ];
      }
    }
  }

  return object;
}

export const allowNullableProperties = (allow: boolean, object: any): any => {
  const rule = (o) =>  o.type !== 'object' && o.type !== 'array';

  return allowNullable(allow, object, rule);
};

export const allowNullableObjects = (allow: boolean, object: any): any => {
  const rule = (o) => o.type === 'object' || o.type === 'array';

  return allowNullable(allow, object, rule);
};

export const getProperties = (object: any): string[] => {
  return Object.keys(object).filter(k => object.hasOwnProperty(k));
};
