import { expect } from 'chai';
import { encodeJsonProperty, toJson } from '../../src/util/json';

describe('encode json test', () => {

  describe('multiple "~" and "/"', () => {

    const property = '~/~/';

    it('will all be encoded', () => {
      expect(encodeJsonProperty(property)).to.be.equal('~0~1~0~1');
    });

  });

});

describe('to json test', () => {

    const str = '\{ "a": true \}';
    const obj = { a: true };
    const arr = [ {}, {} ];

    it('will parse str', () => {
      expect(toJson(arr)).to.not.throw;
      expect(toJson(str)).to.be.deep.equal({ a: true });
    });

    it('will parse obj', () => {
      expect(toJson(arr)).to.not.throw;
      expect(toJson(obj)).to.be.deep.equal({ a: true });
    });
    
    it('will parse arr', () => {
      expect(toJson(arr)).to.not.throw;
      expect(toJson(arr)).to.be.deep.equal([ {}, {} ]);
    });

});
