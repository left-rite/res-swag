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
    const emt = {};
    const bln = '';
    const nul = null;
    const und = undefined;

    describe('strict mode', () => {

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
  
      
      it('will parse empty', () => {
        expect(toJson(emt)).to.not.throw;
        expect(toJson(emt)).to.be.deep.equal({});
      });
      
      it('will parse blank', () => {
        expect(() => toJson(bln)).to.throw('Could not parse input to json: SyntaxError: Unexpected end of JSON input');
      });
      
      it('will parse null', () => {
        expect(() => toJson(nul)).to.throw(`Cannot read property 'constructor' of null`);
      });
  
      it('will parse undefined', () => {
        expect(() => toJson(und)).to.throw(`Cannot read property 'constructor' of undefined`);
      });

    });
    
    describe('non-strict mode', () => {

      it('will parse str', () => {
        expect(toJson(arr, false)).to.not.throw;
        expect(toJson(str, false)).to.be.deep.equal({ a: true });
      });
  
      it('will parse obj', () => {
        expect(toJson(arr, false)).to.not.throw;
        expect(toJson(obj, false)).to.be.deep.equal({ a: true });
      });
      
      it('will parse arr', () => {
        expect(toJson(arr, false)).to.not.throw;
        expect(toJson(arr, false)).to.be.deep.equal([ {}, {} ]);
      });
  
      
      it('will parse empty', () => {
        expect(toJson(emt, false)).to.not.throw;
        expect(toJson(emt, false)).to.be.deep.equal({});
      });
      
      it('will parse blank', () => {
        expect(toJson(bln, false)).to.not.throw;
        expect(toJson(bln, false)).to.be.deep.equal({});
      });
      
      it('will parse null', () => {
        expect(toJson(nul, false)).to.not.throw;
        expect(toJson(nul, false)).to.be.deep.equal({});
      });
  
      it('will parse undefined', () => {
        expect(toJson(und, false)).to.not.throw;
        expect(toJson(und, false)).to.be.deep.equal({});
      });
      
    });

});
