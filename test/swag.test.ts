import { expect } from 'chai';
import { Swag } from '../src/swag';

const swagger = require('./resources/swagger-2.json');
const swaggerAllOf = require('./resources/swagger-2-allOf.json');
const openApi = require('./resources/openapi-3.json');

describe('swag test', () => {

  let swag: Swag;

  before('new Swag', () => {
    const jsonPaths = {
      url: 'req.url',
      method: 'req.method',
      status: 'status',
      contentType: 'headers.content-type',
      responseBody: 'body',
    };
    
    swag = new Swag(jsonPaths)

    swag.ajv.addFormat('int32', {
      type: 'number',
      validate: (n) => Math.abs(n) < Math.pow(2, 31),
    });
  });

  describe('validate response object with additional property against schema with banUnknownProperties = false', () => {
    
    it('will result in a pass', () => {
      const getResources = {
        status: 200,
        body: {
          attributeOne: 'is a string',
          attributeTwo: {
            subAttributeOne: 9,
            subAttributeTwo: true,
            shouldNotExist: 'yes',
          },
        },
        req: {
          url: 'http://v1/resources?member=1234567',
          method: 'get',
        }
      };

      const result = swag.validate(swagger, getResources, { banUnknownProperties: false });
      expect(result).to.be.true;
    });

  });
  
  describe('validate response object with additional property against schema with banUnknownProperties = true', () => {

    it('will result in a fail', () => {
      const getResources = {
        status: 200,
        body: {
          attributeOne: 'is a string',
          attributeTwo: {
            subAttributeOne: 9,
            subAttributeTwo: true,
            shouldNotExist: 'yes',
          },
        },
        req: {
          url: 'http://v1/resources?member=1234567',
          method: 'get',
        }
      };
      
      const result = swag.validate(swagger, getResources, { banUnknownProperties: true });
      expect(result).to.be.not.true;
    });

  });
  
  describe('validate response object with null property against schema with implicitNullableProperties = true', () => {

    it('will result in a pass', () => {
      const getMoreResources = {
        status: 200,
        body: {
          attributeOne: 'is a string',
          attributeTwo: {
            subAttributeOne: null,
            subAttributeTwo: true,
          },
        },
        req: {
          url: 'http://v1/resources?member=7891011',
          method: 'get',
        }
      };

      const result = swag.validate(swagger, getMoreResources, { implicitNullableProperties: true });
      expect(result).to.be.true;
    });

  });
  
  describe('validate response object with null property against schema with implicitNullableProperties = false', () => {

    it('will result in a fail', () => {
      const getMoreResources = {
        status: 200,
        body: {
          attributeOne: 'is a string',
          attributeTwo: {
            subAttributeOne: null,
            subAttributeTwo: true,
          },
        },
        req: {
          url: 'http://v1/resources?member=7891011',
          method: 'get',
        }
      };

      const result = swag.validate(swagger, getMoreResources, { implicitNullableProperties: false });

      expect(result).to.be.not.true;
    });

  });

  describe('url will match with the longest regex i.e. best match', () => {

    it('will result in a pass', () => {    
      const deleteResource = {
        status: 204,
        body: {},
        req: {
          url: 'http://v1/resources/19',
          method: 'delete',
        }
      };

      const result = swag.validate(swagger, deleteResource);
      expect(result).to.be.true;
    });

  });

  describe('request basePath does not match the swagger basePath', () => {

    it('will result in an error', () => {
      const getResources = {
        status: 200,
        body: {
          attributeOne: 'is a string',
          attributeTwo: {
            subAttributeOne: 9,
            subAttributeTwo: true,
            shouldNotExist: 'yes',
          },
        },
        req: {
          url: 'http://v2/resources/19',
          method: 'get',
        }
      };

      let result;
      try { swag.validate(swagger, getResources) } catch(e) { result = e };
      
      expect(result).to.be.instanceOf(Error);
    });

  });

  describe('request path does not match the swagger paths', () => {

    it('will result in an error', () => {
      const getResources = {
        status: 200,
        body: {
          attributeOne: 'is a string',
          attributeTwo: {
            subAttributeOne: 9,
            subAttributeTwo: true,
            shouldNotExist: 'yes',
          },
        },
        req: {
          url: 'http://v1/does/not/exist',
          method: 'get',
        }
      };

      let result;
      try { swag.validate(swagger, getResources) } catch(e) { result = e };
      
      expect(result).to.be.instanceOf(Error);
    });

  });

  describe('request method does not match the swagger methods', () => {
    it('will result in an error', () => {
      const getResources = {
        status: 200,
        body: {
          attributeOne: 'is a string',
          attributeTwo: {
            subAttributeOne: 9,
            subAttributeTwo: true,
            shouldNotExist: 'yes',
          },
        },
        req: {
          url: 'http://v1/resources/19',
          method: 'post',
        }
      };

      let result;
      try { swag.validate(swagger, getResources) } catch(e) { result = e };
      
      expect(result).to.be.instanceOf(Error);
    });
  });

  describe('request status does not match the swagger statuses', () => {
    it('will result in an error', () => {
      const getResources = {
        status: 201,
        body: {
          attributeOne: 'is a string',
          attributeTwo: {
            subAttributeOne: 9,
            subAttributeTwo: true,
            shouldNotExist: 'yes',
          },
        },
        req: {
          url: 'http://v1/resources/19',
          method: 'get',
        }
      };

      let result;
      try { swag.validate(swagger, getResources) } catch(e) { result = e };
      
      expect(result).to.be.instanceOf(Error);
    });
  });

  describe('swagger with allOf', () => {
    const postFood = {
      status: 201,
      body: {
        toppings: [
          'pineapple'
        ],
        sprinkles: {
          flavour: 'chocolate',
          amount: 4
        },
        notSupposedToBeHere: 'test',
      },
      req: {
        url: 'http://v1/resources',
        method: 'post',
      }
    };

    it('will result in a fail when additional property exists and banUnknownProperties = true', () => {
      let result;
      try { result = swag.validate(swaggerAllOf, postFood, { banUnknownProperties: true }) } catch(e) { result = e };
      
      expect(result, JSON.stringify(result, null, 2)).to.not.be.true;
      expect(result.errors, JSON.stringify(result, null, 2)).to.be.be.instanceOf(Array);
    });

    it('will result in a pass when additional property exists banUnknownProperties = false', () => {
      let result;
      try { result = swag.validate(swaggerAllOf, postFood, { banUnknownProperties: false }) } catch(e) { result = e };
      
      expect(result, JSON.stringify(result, null, 2)).to.be.true;
    });

  });

  describe('open-api 3.0 spec', () => {
    const CONTENT_TYPE = 'content-type';
    const getResponse = {
      status: 200,
      body: {
        attributeOne: 'a string',
        attributeTwo: {
          subAttributeOne: 777,
          subAttributeTwo: true,
        },
      },
      req: {
        url: 'http://v1/resources/777',
        method: 'get',
      },
      headers: {
        [CONTENT_TYPE]: 'application/json',
      },
    };

    it('will result in a pass', () => {
      let result;
      try { result = swag.validate(openApi, getResponse) } catch(e) { result = e };
      
      expect(result, JSON.stringify(result, null, 2)).to.be.true;
    });
  });

});
