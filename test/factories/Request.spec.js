import _ from 'lodash';
import Request from '../../src/factories/Request';

describe(`Request`, () => {

  it(`should be a function`, (done) => {
    expect(Request).to.be.a('function');
    done();
  });

  describe(`const req = Request(Object params)`, () => {

    it(`should return an instance of Request`, (done) => {
      const req = Request();

      expect(req).to.be.an.instanceOf(Request);

      done();
    });

    it(`should use the session specified on Request.session `, (done) => {
      Request.session = 'abc';
      const req = Request();

      expect(req.session).to.equal(Request.session);

      done();
    });

    it(`Should set the provided params on req.params`, (done) => {
      const params = {};
      const req = Request(params);

      expect(req.params).to.equal(params);

      done();
    });

    describe(`req.param(String key)`, () => {

      it(`should get a parameter by key/path deeply`, (done) => {
        const params = {
          some: {
            nested: {
              param: 'value'
            }
          }
        };

        const req = Request(params);
        const actual = req.param('some.nested.param');
        const expected = params.some.nested.param;

        expect(actual).to.equal(expected);

        done();
      })

    });

  });

});