import _ from 'lodash';
import Runner from '../../src/factories/Runner';
import Request from '../../src/factories/Request';
import Chain from '../../src/factories/Chain';

describe(`Runner`, () => {

  it(`should be a function`, (done) => {
    expect(Runner).to.be.a('function');
    done();
  });

  describe(`const chain = Runner(Object options)`, () => {

    it(`should return an instance of Runner`, (done) => {
      expect(Runner()).to.be.an.instanceOf(Runner);
      done();
    });

    it(`should set the passed in session on the Request.session`, (done) => {
      const expectedSession = {};
      Runner({
        session: expectedSession
      });

      const actualSession = Request.session;

      expect(actualSession).to.equal(expectedSession);

      done();
    });

    it(`should expose the passed in middleware on runner.middleware`, (done) => {
      const expectedMiddleware = {};
      const runner = Runner({
        middleware: expectedMiddleware
      });

      const actualMiddleware = runner.middleware;

      expect(actualMiddleware).to.equal(expectedMiddleware);

      done();
    });

    describe(`runner.execute(Array<String> middleware, Object<*> params, Object<*> data, Function sync, Function destruct)`, () => {

      it.skip(`should return what is returned by Chain#execute`, (done) => {
        done();
      });

      it(`should create a Chain and execute it using the provided params, data, sync and destruct arguments`, () => {
        const execute = Chain.prototype.execute;
        Chain.prototype.execute = mockFunction();

        const params = {};
        const data = {};
        const sync = {};
        const destruct = {};

        const runner = Runner();

        runner.execute([], params, data, sync, destruct);
        verify(Chain.prototype.execute)(params, data, sync, destruct);

        Chain.prototype.execute = execute;
      });

    });

  });

});