import { ServerInfoNavigator } from '../../src/open-api/server-info';
import { OpenApi3 } from '../../src/models/openapi-3.0.model';
import { expect } from 'chai';

describe('ServerInfoNavigator test', () => {
  const serverInfoNav = new ServerInfoNavigator();
  
  it('matching server with defined basePath', () => {
    const openApi: Partial<OpenApi3> = {
      servers: [
        {
          url: 'https://supplies.com/toiletpaper',
          variables: {
            basePath: {
              default: '/sheets',
            },
          },
        },
      ],
    };

    const basePath = serverInfoNav.getBasePath(openApi as OpenApi3, 'https://supplies.com/toiletpaper/sheets/3', true);
    
    expect(basePath).to.be.equal('/sheets');
  });

  it('matching server without defined basePath, should get path from url', () => {
    const openApi: Partial<OpenApi3> = {
      servers: [
        {
          url: 'https://supplies.com/this/is/the/basePath',
        },
      ],
    };

    const basePath = serverInfoNav.getBasePath(openApi as OpenApi3, 'https://supplies.com/this/is/the/basePath/and/more', true);
    
    expect(basePath).to.be.equal('/this/is/the/basePath');
  });

  it('matching server without defined basePath and no path in url, should return null', () => {
    const openApi: Partial<OpenApi3> = {
      servers: [
        {
          url: 'https://supplies.com',
        },
      ],
    };

    const basePath = serverInfoNav.getBasePath(openApi as OpenApi3, 'https://supplies.com/this/is/the/basePath/and/more', true);
    
    expect(basePath).to.be.equal('');
  });
  
  it('no matching server but defined basePath for a single server', () => {
    const openApi: Partial<OpenApi3> = {
      servers: [
        {
          url: 'https://supplies.com',
          variables: {
            basePath: {
              default: '/found/it'
            }
          }
        },
      ],
    };

    const basePath = serverInfoNav.getBasePath(openApi as OpenApi3, 'https://dev-env.supplies.com/this/is/the/basePath/and/more', true);
    
    expect(basePath).to.be.equal('/found/it');
  });

  it('no matching server but defined basePath for multiple servers same basePath', () => {
    const openApi: Partial<OpenApi3> = {
      servers: [
        {
          url: 'https://supplies.com',
          variables: {
            basePath: {
              default: '/found/it'
            }
          }
        },
        {
          url: 'https://pre-prod.supplies.com',
          variables: {
            basePath: {
              default: '/found/it'
            }
          }
        },
      ],
    };

    const basePath = serverInfoNav.getBasePath(openApi as OpenApi3, 'https://dev-env.supplies.com/this/is/the/basePath/and/more', true);
    
    expect(basePath).to.be.equal('/found/it');
  });

  it('no matching server but defined basePath for multiple servers different but similar basePath', () => {
    const openApi: Partial<OpenApi3> = {
      servers: [
        {
          url: 'https://supplies.com',
          variables: {
            basePath: {
              default: '/common/sequence'
            }
          }
        },
        {
          url: 'https://pre-prod.supplies.com',
          variables: {
            basePath: {
              default: '/follow/the/common/sequence'
            }
          }
        },
      ],
    };

    const basePath = serverInfoNav.getBasePath(openApi as OpenApi3, 'https://dev-env.supplies.com/this/is/the/basePath/and/more', true);
    
    expect(basePath).to.be.equal('/common/sequence');
  });

  it('no matching server and no defined basePath, single server', () => {
    const openApi: Partial<OpenApi3> = {
      servers: [
        {
          url: 'https://supplies.com/v2/resource',
        }
      ],
    };

    const basePath = serverInfoNav.getBasePath(openApi as OpenApi3, 'https://dev-env.supplies.com/this/is/the/basePath/and/more', true);
    
    expect(basePath).to.be.equal('/v2/resource');
  });

  it('no matching server and no defined basePath, multiple servers and all same path', () => {
    const openApi: Partial<OpenApi3> = {
      servers: [
        {
          url: 'https://supplies.com/v2/resource',
        },
        {
          url: 'https://pre-prod.supplies.com/v2/resource',
        }
      ],
    };

    const basePath = serverInfoNav.getBasePath(openApi as OpenApi3, 'https://dev-env.supplies.com/this/is/the/basePath/and/more', true);
    
    expect(basePath).to.be.equal('/v2/resource');
  });

  it('no matching server and no defined basePath, multiple servers with different ports but all same path', () => {
    const openApi: Partial<OpenApi3> = {
      servers: [
        {
          url: 'https://supplies.com/v2/resource',
        },
        {
          url: 'https://pre-prod.supplies.com:3030/v2/resource',
        }
      ],
    };

    const basePath = serverInfoNav.getBasePath(openApi as OpenApi3, 'https://dev-env.supplies.com/this/is/the/basePath/and/more', true);
    
    expect(basePath).to.be.equal('/v2/resource');
  });

  it('no matching server and no defined basePath, multiple servers but slightly diff paths', () => {
    const openApi: Partial<OpenApi3> = {
      servers: [
        {
          url: 'https://supplies.com/ignore/this/part/v2/resource',
        },
        {
          url: 'https://pre-prod.supplies.com/hidden/v2/resource',
        },
        {
          url: 'https://pre-prod.supplies.com/v2/resource',
        }
      ],
    };

    const basePath = serverInfoNav.getBasePath(openApi as OpenApi3, 'https://dev-env.supplies.com/this/is/the/basePath/and/more', true);
    
    expect(basePath).to.be.equal('/v2/resource');
  });

});