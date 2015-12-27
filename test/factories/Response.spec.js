import _ from 'lodash';
import Response from '../../src/factories/Response';

describe(`Response`, () => {

  it(`should be a function`, (done) => {
    expect(Response).to.be.a('function');
    done();
  });

  describe(`const res = Response(Object data)`, () => {

    it(`should return an instance of Response`, (done) => {
      const res = Response();

      expect(res).to.be.an.instanceOf(Response);

      done();
    });

    it(`should extend itself with the data provided and ignore the toObject property`, (done) => {
      const resProperty = 'shouldBeAddedToResponse';

      const res = Response({
        toObject: 'shouldBeIgnored',
        resProperty
      });

      expect(res.resProperty).to.equal(resProperty, `Response should extend itself with the data provided`);
      expect(res.toObject).to.equal(Response.prototype.toObject, `The toObject method may not be overridden`);

      done();
    });

    describe(`res.sync = function () {...}`, () => {

      it(`should execute all assigned functions with data when calling res.sync(data)`, (done) => {
        const res = Response();
        const expectedData = {
          data: 'someVal'
        };

        const sync = mockFunction();
        const sync2 = mockFunction();

        res.sync = sync;
        res.sync = sync2;

        res.sync(expectedData);

        verify(sync)(expectedData);
        verify(sync2)(expectedData);

        done();
      });

      it(`if assigned to an object and obj.sync is a function it should be called with data instead`, (done) => {
        const res = Response();
        const expectedData = {
          data: 'someVal'
        };

        const sync = mockFunction();
        const sync2 = mockFunction();

        res.sync = {sync: sync};
        res.sync = {sync: sync2};

        res.sync(expectedData);

        verify(sync)(expectedData);
        verify(sync2)(expectedData);

        done();
      });

    });

    describe(`res.destruct = function () {...}`, () => {

      it(`should execute all assigned functions when calling res.destruct()`, (done) => {
        const res = Response();
        const destruct = mockFunction();
        const destruct2 = mockFunction();

        res.destruct = destruct;
        res.destruct = destruct2;

        res.destruct();

        verify(destruct)();
        verify(destruct2)();

        done();
      });

      it(`if assigned to an object and obj.stop is a function it should be called instead`, (done) => {
        const res = Response();
        const destruct = mockFunction();
        const destruct2 = mockFunction();

        res.destruct = {stop: destruct};
        res.destruct = {stop: destruct2};

        res.destruct();

        verify(destruct)();
        verify(destruct2)();

        done();
      });

    });

    describe(`res.toObject()`, () => {

      it(`Should return the Response with all methods removed`, () => {
        const res = Response({

          someMethod() {

          },

          someProperty: true

        });

        const obj = res.toObject();
        const resWithoutMethods = _.omit(res, _.methods(res));

        expect(obj).to.deep.equal(resWithoutMethods);

      });

    });

  });

});