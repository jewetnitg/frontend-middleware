/**
 * @author rik
 */
import MiddlewareRunner from '../../src/factories/MiddlewareRunner';

describe(`MiddlewareRunner`, () => {

  it(`should be a function`, (done) => {
    expect(MiddlewareRunner).to.be.a('function');
    done();
  });

});