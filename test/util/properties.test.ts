import { expect } from 'chai';
import { banUnknownProperties, allowNullableProperties, allowNullableObjects } from '../../src/util/properties';

describe('additional properties test', () => {

  const obj = {
    type: 'object',
    properties: {
      anotherObject: {
        type: 'object',
        properties: {
          thisIsAString: 'string',
        },
        additionalProperties: true,
        example: {
          thisIsAString: null,
        },
      },
    },
  };

  describe('banUnknownProperties = false', () => {

    const additionalPropertiesObject = banUnknownProperties(false, Object.assign(obj));

    it('will not add additionalProperties = true', () => {
      expect(additionalPropertiesObject.additionalProperties).to.be.undefined;
    });

    it('will not modify pre-existing additionalProperties', () => {
      expect(additionalPropertiesObject.properties.anotherObject.additionalProperties).to.be.true;
    });

  });

});


describe('nullability test', () => {

  describe('allowNullableProperties = true', () => {

    const obj = {
      type: 'object',
      properties: {
        anotherObject: {
          type: 'object',
          properties: {
            thisIsAString: {
              type: 'string',
            },
            thisIsANumber: {
              type: 'number',
            },
          },
          additionalProperties: true,
          example: {
            thisIsAString: null,
            thisIsANumber: null,
          },
        },
      },
    };

    const nullablePropertiesObject = allowNullableProperties(true, obj);

    it('will modify object to make string and number types nullable', () => {
      expect(nullablePropertiesObject).to.deep.equal({
        type: 'object',
        properties: {
          anotherObject: {
            type: 'object',
            properties: {
              thisIsAString: {
                type: ['string', 'null'],
              },
              thisIsANumber: {
                type: ['number', 'null'],
              },
            },
            additionalProperties: true,
            example: {
              thisIsAString: null,
              thisIsANumber: null,
            },
          },
        },
      });
    });

  });
  
  describe('allowNullableObjects = true', () => {

    const obj = {
      type: 'object',
      properties: {
        anotherObject: {
          type: 'object',
          properties: {
            thisIsAString: {
              type: 'string',
            },
            thisIsANumber: {
              type: 'number',
            },
          },
          additionalProperties: true,
          example: {
            thisIsAString: null,
            thisIsANumber: null,
          },
        },
      },
    };
    const nullableObjectObject = allowNullableObjects(true, obj);

    it('will modify object to make object types nullable', () => {
      expect(nullableObjectObject).to.deep.equal({
        type: ['object', 'null'],
        properties: {
          anotherObject: {
            type: ['object', 'null'],
            properties: {
              thisIsAString: {
                type: 'string',
              },
              thisIsANumber: {
                type: 'number',
              },
            },
            additionalProperties: true,
            example: {
              thisIsAString: null,
              thisIsANumber: null,
            },
          },
        },
      });
    });

  });

});
