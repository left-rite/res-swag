export const encodeJsonProperty = (property: string): string => property.replace(/\~/g, '~0').replace(/\//g, '~1');

export const toJson = (input: any): any => {
  switch (input.constructor) {
    case {}.constructor: 
    case [].constructor:
      return input;
    case ''.constructor:
      return JSON.parse(input);
    default:
      throw new Error('Could not parse input');
  }
}
