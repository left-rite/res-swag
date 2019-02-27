import { expect } from 'chai';
import { toRegex } from '../../src/util/regex';

describe('regex test', () => {

  describe('path is turned into the correct regex', () => {

    const path = '/street/{name}/house/{number}';
    const regex = toRegex(path);

    it('will all be encoded', () => {
      expect(regex.source).to.be.equal('\\/street\\/([a-zA-Z0-9_-]+)\\/house\\/([a-zA-Z0-9_-]+)(?!\\/+.)');
    });

  });

});
