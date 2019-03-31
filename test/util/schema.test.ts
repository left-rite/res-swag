import { expect } from 'chai';
import { mergeSubschemas } from '../../src/util/schema';

describe('schema test', () => {

  const obj = {
    allOf: [ 
      {
        a: {}
      },
      {
        b: true,
      },
      {
        c: [],
      },
      {
        d: null,
      },
      {
        e: false,
      },
      {
        e: 'value',
      },
      {
        f: 1,
      },
      {
        f: 0,
      },
      {
        g: {
          aa: 'aa'
        }
      },
      {
        g: {
          bb: 'bb'
        }
      }
    ],
    g: {
      aa: 'bad',
      cc: 'cc'
    },
    h: ''
  };

  describe('mergeSubschemas()', () => {

    it('will have the correct value', () => {
      expect(mergeSubschemas(obj)).to.deep.equal({
        a: {},
        b: true,
        c: [],
        d: null,
        e: 'value',
        f: 0,
        g: {
          aa: 'aa',
          bb: 'bb',
          cc: 'cc',
        },
        h: '',
      });
    });

  });

});
