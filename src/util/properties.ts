import { isNullOrUndefined } from 'util';

export const banUnknownProperties = (ban: boolean, object: any): any => {
  if (ban && object && typeof object === 'object') {
    getProperties(object).forEach(p => banUnknownProperties(ban, object[p]));

    if (object.type === 'object' && isNullOrUndefined(object.additionalProperties)) {
      object.additionalProperties = false;
    }
  }
  
  return object;
};

export const allowNullable = (allow: boolean, object: any, rule: (obj: any) => boolean): any => {
  if (allow && object && typeof object === 'object') {
    getProperties(object).forEach(p => allowNullable(allow, object[p], rule));

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
  return Object.getOwnPropertyNames(object);
};
