import { expect } from 'chai';
import { get } from '../../src/util/get';

describe('get test', () => {

  const obj = {
    a: {
      b: '1'
    }
  };

  describe('getting value of object.a.b by json path', () => {

    it('will have the correct value', () => {
      expect(get(obj, 'a.b')).to.be.equal('1');
    });

  });

});
