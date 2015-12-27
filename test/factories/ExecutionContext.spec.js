import _ from 'lodash';
import ExecutionContext from '../../src/factories/ExecutionContext';
import Response from '../../src/factories/Response';

describe(`ExecutionContext`, () => {

  it(`should be a function`, (done) => {
    expect(ExecutionContext).to.be.a('function');
    done();
  });

  describe(`const executionContext = ExecutionContext(Object options)`, () => {

    it(`should return an instance of ExecutionContext`, (done) => {
      const executionContext = ExecutionContext();

      expect(executionContext).to.be.an.instanceOf(ExecutionContext);

      done();
    });

    it(`should set the chain property to the provided Chain property in the options`, (done) => {
      const chain = {};
      const executionContext = ExecutionContext({
        chain
      });

      expect(executionContext.chain).to.equal(chain);

      done();
    });

    it(`should create a Request and pass it the params provided in the options and put it on executionContext.req`, (done) => {
      const params = {};
      const executionContext = ExecutionContext({
        params
      });

      expect(executionContext.req.params).to.equal(params);

      done();
    });

    it(`should create a Response and pass it the data provided in the options and put it on executionContext.res`, (done) => {
      const data = {};
      const originalResFactory = Response.factory;

      Response.options.factory = mockFunction();

      const executionContext = ExecutionContext({
        data
      });

      verify(Response.options.factory)(data);

      Response.options.factory = originalResFactory;

      done();
    });

    it(`should add the provided destruct method to the Response`, (done) => {
      const destruct = mockFunction();

      const executionContext = ExecutionContext({
        destruct
      });

      executionContext.res.destruct();

      verify(destruct)();

      done();
    });

    it(`should add the provided sync method to the Response`, (done) => {
      const sync = mockFunction();
      const actualArgument = {};
      const executionContext = ExecutionContext({
        sync
      });

      executionContext.res.sync(actualArgument);

      verify(sync)(actualArgument);

      done();
    });

    it(`should set the options passed in on executionContext.options`, (done) => {
      const options = {};
      const executionContext = ExecutionContext(options);

      expect(executionContext.options).to.equal(options);

      done();
    });

    describe(`executionContext.then(Function onFulfilled, Function onRejected)`, () => {

      it(`should call executionContext.promise.then with the onFulfilled and onRejected arguments passed in`, (done) => {
        const executionContext = ExecutionContext();
        const expectedArgument = {};
        const expectedArgument2 = {};
        const thenFn = mockFunction();

        executionContext.promise = {};
        executionContext.promise.then = thenFn;

        executionContext.then(expectedArgument, expectedArgument2);

        verify(thenFn)(expectedArgument, expectedArgument2);

        done();
      });

    });

    describe(`executionContext.catch(Function onRejected)`, () => {

      it(`should call executionContext.promise.catch with the onRejected argument passed in`, (done) => {
        const executionContext = ExecutionContext();
        const expectedArgument = {};
        const catchFn = mockFunction();

        executionContext.promise = {};
        executionContext.promise.catch = catchFn;

        executionContext.catch(expectedArgument);

        verify(catchFn)(expectedArgument);

        done();
      });

    });

    describe(`executionContext.destroy()`, () => {

      it(`should call executionContext.res.destruct`, (done) => {
        const executionContext = ExecutionContext();
        const destructFn = mockFunction();

        executionContext.res.destruct = destructFn;

        executionContext.destroy();

        verify(destructFn)();

        done();
      });

    });

  });

});