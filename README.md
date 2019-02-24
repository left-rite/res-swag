# res-swag - the Swagger/OpenAPI validator for responses
## Description
```res-swag``` takes the response from a request to an API and validates it against a given Swagger/OpenAPI definition
Currently supports Swagger 2 and OpenAPI 3

## Example

```javascript
import { Swag } from 'res-swag';

const jsonPaths = {
  url: 'req.url',
  method: 'req.method',
  status: 'status',
  responseBody: 'body',
};

const swag = new Swag(jsonPaths);

swag.ajv.addFormat('int32', {
  type: 'number',
  validate: (n) => Math.abs(n) < Math.pow(2, 31),
});

swag.validate(definition, response, options);
```


### Details
The ```jsonPaths``` object lets the validator know where to find the url, method, status and response body to the response of the API request.
E.g. if the response from has the following shape:
```javascript
interface Response {
  req: {
    url: string,
    method: string,
  },
  status: number,
  body,
}
```
then the ```jsonPaths``` object should look like:

```javascript
const jsonPaths = {
  url: 'req.url',
  method: 'req.method',
  status: 'status',
  responseBody: 'body',
};
```

```res-swag``` uses ajv for validation. To add formats etc, you can access ajv like so

```javascript
swag.ajv.addFormat('int32', {
  type: 'number',
  validate: (n) => Math.abs(n) < Math.pow(2, 31),
});
```

The validation function ```swag.validate``` takes the following arguments:

* definition ```string | any``` - the Swagger or OpenAPI definition for the API that was called in the HTTP request, this can be the raw (string) YAML or parsed YAML (json object)
* response ```any``` - the response object from the API request
* options ```Partial<SwagOptions>``` (optional) - this will override the defaults:
```javascript
{
  banUnknownProperties: true,
  allowNullableProperties: true,
  allowNullableObjects: true,
  ignoreUnknownServer: true,
}
```






