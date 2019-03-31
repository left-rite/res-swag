export const encodeJsonProperty = (property: string): string => property.replace(/\~/g, '~0').replace(/\//g, '~1');

const empties = [ '', null, undefined ];

export const toJson = (input: any, strict: boolean = true): any => {
  if (!strict && empties.includes(input)) { 
    return {}; 
  }

  switch (input.constructor) {
    case {}.constructor: 
    case [].constructor:
      return input;
    case ''.constructor:
      try { 
        return JSON.parse(input); 
      } catch (e) {
        throw new Error(`Could not parse input to json: ${e}`);
      }
    default:
      throw new Error('Could not parse input');
  }
}
