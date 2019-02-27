import { expect } from 'chai';
import { findBestPath } from '../../src/util/path';

describe('path test', () => {

  describe('match url "http://server/waiter/anchor?eh=ae" against "/", "/{id}"', () => {
    
    const paths = [
      '/',
      '/{id}'
    ];

    const url = 'http://server/waiter/anchor?eh=ae'

    it(`when basePath '/anchor' is supplied will result in "/" being best match`, () => {
      expect(findBestPath(url, paths, '/anchor')).to.be.equal('/');
    });

    it(`when basePath '/waiter' is supplied will result in "/" being best match`, () => {
      expect(findBestPath(url, paths, '/waiter')).to.be.equal('/{id}');
    });

    it(`when basePath is not supplied will result in "/" being best match`, () => {
      expect(findBestPath(url, paths)).to.be.equal('/');
    });

  });

  describe('match url "http://server/waiter/anchor?eh=ae" against "/", "/{id}", "/anchor"', () => {
    
    const paths = [
      '/',
      '/{id}',
      '/anchor',
      '/anchor/{id}'
    ];
    
    const url = 'http://server/waiter/anchor?eh=ae'

    it(`when basePath '/waiter' is supplied will result in "/anchor" being best match`, () => {
      expect(findBestPath(url, paths, '/waiter')).to.be.equal('/anchor');
    });
    
    it(`when basePath is not supplied will result in "/anchor" being best match`, () => {
      expect(findBestPath(url, paths, '/waiter')).to.be.equal('/anchor');
    });
  });

  describe('match url "http://server/waiter/anchor/what" against "/", "/{id}", "/anchor", "/anchor/{id}"', () => {
    
    const paths = [
      '/',
      '/{id}',
      '/anchor',
      '/anchor/{id}'
    ];
    
    const url = 'http://server/waiter/anchor/what'

    it(`when basePath '/waiter' is supplied will result in "/anchor/{id}" being best match`, () => {
      expect(findBestPath(url, paths, '/waiter')).to.be.equal('/anchor/{id}');
    });

    it(`when basePath is not supplied will result in "/anchor/{id}" being best match`, () => {
      expect(findBestPath(url, paths)).to.be.equal('/anchor/{id}');
    });
  });

});
