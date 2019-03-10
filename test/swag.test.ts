import { expect } from 'chai';
import { Swag } from '../src/swag';

const swagger = require('./resources/swagger-2.json');
const swaggerAllOf = require('./resources/swagger-2-allOf.json');
const openApi = require('./resources/openapi-3.json');

const CONTENT_TYPE = 'content-type';

describe('swag test', () => {
  let swag: Swag;

  before('new Swag', () => {
    const jsonPaths = {
      url: '/req/url',
      method: '/req/method',
      status: '/status',
      headers: '/header',
      responseBody: '/body',
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
        header: {
          [CONTENT_TYPE]: 'application/json',
        },
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
        header: {
          [CONTENT_TYPE]: 'application/json',
        },
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
        header: { 
          [CONTENT_TYPE]: 'application/json'
        },
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
        header: { 
          [CONTENT_TYPE]: 'application/json'
        },
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

  describe('url will match with the regex best matched', () => {

    it('will result in a pass', () => {    
      const deleteResource = {
        status: 204,
        header: { 
          [CONTENT_TYPE]: 'application/json'
        },
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
        header: { 
          [CONTENT_TYPE]: 'application/json'
        },
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
        header: { 
          [CONTENT_TYPE]: 'application/json'
        },
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
        header: { 
          [CONTENT_TYPE]: 'application/json'
        },
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
        header: { 
          [CONTENT_TYPE]: 'application/json'
        },
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
      header: { 
        [CONTENT_TYPE]: 'application/json'
      },
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
    const getResponse = {
      status: 200,
      header: {
        [CONTENT_TYPE]: 'application/json',
      },
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
    };

    it('will result in a pass', () => {
      let result;
      try { result = swag.validate(openApi, getResponse) } catch(e) { result = e };
      
      expect(result, JSON.stringify(result, null, 2)).to.be.true;
    });
  });

  describe('paths pointed to incorrect properties in response data', () => {
    const url = '/req/url';
    const status = '/status';
    const method = '/req/method'
    const headers = '/header';
    const responseBody = '/body';

    const getResponse = {
      status: 200,
      header: {
        [CONTENT_TYPE]: 'application/json',
      },
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
    };

    it('will fail if url is incorrectly defined in path', () => {
      const incorrectUrl = '/bad/url';
      const badSwag = new Swag({ url: incorrectUrl, status, method, headers, responseBody });
      
      badSwag.ajv.addFormat('int32', { type: 'number', validate: (n) => Math.abs(n) < Math.pow(2, 31) });

      expect(() => badSwag.validate(openApi, getResponse))
        .throws(/^Object does not have a property of \'bad\'/);
    });

    it('will fail if status is incorrectly defined in path', () => {
      const incorrectStatus = '/bad/status';
      const badSwag = new Swag({ url, status: incorrectStatus, method, headers, responseBody });
      
      badSwag.ajv.addFormat('int32', { type: 'number', validate: (n) => Math.abs(n) < Math.pow(2, 31) });

      expect(() => badSwag.validate(openApi, getResponse))
        .throws(/^Object does not have a property of \'bad\'/);
    });

    it('will fail if method is incorrectly defined in path', () => {
      const incorrectmethod = '/bad/method';
      const badSwag = new Swag({ url, status, method: incorrectmethod, headers, responseBody });
      
      badSwag.ajv.addFormat('int32', { type: 'number', validate: (n) => Math.abs(n) < Math.pow(2, 31) });

      expect(() => badSwag.validate(openApi, getResponse))
        .throws(/^Object does not have a property of \'bad\'/);
    });

    it('will fail headers is incorrectly defined in path', () => {
      const incorrectContentType = '/bad/content-type';
      const badSwag = new Swag({ url, status, method, headers: incorrectContentType, responseBody });
      
      badSwag.ajv.addFormat('int32', { type: 'number', validate: (n) => Math.abs(n) < Math.pow(2, 31) });

      expect(() => badSwag.validate(openApi, getResponse))
      .throws(/^Object does not have a property of \'bad\'/);
    });

    
    it('will NOT fail if content-type is empty', () => {
      const emptyContentTypeResponse = {
        status: 404,
        header: {
          [CONTENT_TYPE]: null,
        },
        body: '',
        req: {
          url: 'http://v1/resources/777',
          method: 'get',
        },
      };
      expect(swag.validate(openApi, emptyContentTypeResponse)).to.be.true;
    });

    it('will fail at pointer if response body is incorrectly defined in path (or response body is empty)', () => {
      const incorrectResponseBody = '/bad/response/body';
      const badSwag = new Swag({ url, status, method, headers, responseBody: incorrectResponseBody });
      
      badSwag.ajv.addFormat('int32', { type: 'number', validate: (n) => Math.abs(n) < Math.pow(2, 31) });

      expect(() => badSwag.validate(openApi, getResponse)).throws(/^Object does not have a property of 'bad'/);
    });
  });

  
  describe('casing of values in response body', () => {
    const url = '/req/url';
    const status = '/status';
    const method = '/req/method'
    const headers = '/header';
    const responseBody = '/body';

    const getResponse = {
      status: 200,
      header: {
        [CONTENT_TYPE]: 'application/json',
      },
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
    };

    const legitSwag = new Swag({ url, status, method, headers, responseBody });
    
    legitSwag.ajv.addFormat('int32', {
      type: 'number',
      validate: (n) => Math.abs(n) < Math.pow(2, 31),
    });

    it(`does matter for url`, () => {
      const modifiedResponse = JSON.parse(JSON.stringify(getResponse));
      modifiedResponse.req.url = 'http://v1/Resource/777';

      expect(() => legitSwag.validate(openApi, modifiedResponse))
        .throws('The url "http://v1/Resource/777" did not match available basePath "" and paths "/resources, /resources/{id}');
    });

    it(`doesn't matter for method`, () => {
      const modifiedResponse = JSON.parse(JSON.stringify(getResponse));
      modifiedResponse.req.method = 'GET';
      
      expect(legitSwag.validate(openApi, modifiedResponse)).to.be.true;
    });

    it(`does matter for content-type`, () => {
      const modifiedResponse = JSON.parse(JSON.stringify(getResponse));
      modifiedResponse.header[CONTENT_TYPE] = 'application/JSON';
      
      expect(() => legitSwag.validate(openApi, modifiedResponse))
        .throws('The content-type "application/JSON" did not match any of the available content-types "application/json" in "get /resources/{id} 200');
    });

  });
  
  describe('No content response body against swagger 2 definition', () => {
    const getResponse = (body) => {
      return {
        status: 404,
        header: {},
        body,
        req: {
          url: 'http://v1/resources/888',
          method: 'get',
        },
      };
    };

    it('body=null', () => {
      expect(swag.validate(swagger, getResponse(null))).to.be.true;
    });

    it('body=undefined', () => {
      expect(() => swag.validate(swagger, getResponse(undefined))).to.throw(/^Object does not have a property of 'body'/);
    });

    it('body=\'\'', () => {
      expect(swag.validate(swagger, getResponse(''))).to.be.true;
    });

    it('body={}', () => {
      const func = () => swag.validate(swagger, getResponse({}));

      expect(func).throws(`Expected an empty response body. ${JSON.stringify({ 
          url: 'http://v1/resources/888', 
          responseBody: {},
          schema: '#/paths/~1resources~1{id}/get/responses/404' 
        }, null, 4)}`);
    });

    it(`body={ has: 'item' }`, () => {
      const func = () => swag.validate(swagger, getResponse({ has: 'item' }));

      expect(func).throws(`Expected an empty response body. ${JSON.stringify({ 
          url: 'http://v1/resources/888', 
          responseBody: { has: 'item' }, 
          schema: '#/paths/~1resources~1{id}/get/responses/404' 
        }, null, 4)}`);
    });

  });

  describe('No content response body against openapi 3 definition', () => {
    const getResponse = (body) => {
      return {
        status: 404,
        header: {},
        body,
        req: {
          url: 'http://v1/resources/888',
          method: 'get',
        },
      };
    };

    it('body=null', () => {
      expect(swag.validate(openApi, getResponse(null))).to.be.true;
    });

    it('body=undefined', () => {
      expect(() => swag.validate(openApi, getResponse(undefined))).to.throw(/^Object does not have a property of 'body'/);
    });

    it('body=\'\'', () => {
      expect(swag.validate(openApi, getResponse(''))).to.be.true;
    });

    it('body={}', () => {
      const func = () => swag.validate(openApi, getResponse({}));

      expect(func).throws(`Expected an empty response body. ${JSON.stringify({ 
          url: 'http://v1/resources/888', 
          responseBody: {},
          schema: '#/paths/~1resources~1{id}/get/responses/404' 
        }, null, 4)}`);
    });
    
    it(`body={ has: 'item' }`, () => {
      const func = () => swag.validate(openApi, getResponse({ has: 'item' }));

      expect(func).throws(`Expected an empty response body. ${JSON.stringify({ 
          url: 'http://v1/resources/888', 
          responseBody: { has: 'item' }, 
          schema: '#/paths/~1resources~1{id}/get/responses/404' 
        }, null, 4)}`);
    });

    it(`body="Not found"`, () => {
      const func = () => swag.validate(openApi, getResponse('Not found'));

      expect(func).throws(`Expected an empty response body. ${JSON.stringify({ 
          url: 'http://v1/resources/888', 
          responseBody: 'Not found', 
          schema: '#/paths/~1resources~1{id}/get/responses/404' 
        }, null, 4)}`);
    });

  });

  describe('deep references in endpoint response should resolve properly', () => {
    const getResponse = (body) => {
      return {
        status: 400,
        header: {
          [CONTENT_TYPE]: 'application/json',
        },
        body,
        req: {
          url: 'http://v1/resources',
          method: 'get',
        },
      };
    };

    it('an expected response should pass validation', () => {
      const response = {
        errors: [ 1, 2, 3 ]
      };

      expect(swag.validate(openApi, getResponse(response))).to.be.true;
    });
    
    it('an unexpected response should fail validation', () => {
      const response = {
        errors: [ { o: 3 } ]
      };

      expect(swag.validate(openApi, getResponse(response))).to.not.be.true;
    });

  });
  
});
