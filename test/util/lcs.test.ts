import { expect } from 'chai';
import { lcsRight } from '../../src/util/lcs';

describe('lcs test', () => {

  describe('lcsRight', () => {

    it('when both of the strings are the same should return the same string', () => {
      expect(lcsRight('/should/match/the/whole/thing', '/should/match/the/whole/thing')).to.be.equal('/should/match/the/whole/thing');
    });

    it('when one of the strings is a substring of the other should return a the shortsubstring', () => {
      expect(lcsRight('/match/the/whole/thing', '/should/match/the/whole/thing')).to.be.equal('/match/the/whole/thing');
    });

    it('when one the strings end differenly the result should be blank', () => {
      expect(lcsRight('/poke', 'prod')).to.be.equal('');
    });

  });

});
