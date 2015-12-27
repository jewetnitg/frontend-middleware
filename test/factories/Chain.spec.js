import _ from 'lodash';
import Chain from '../../src/factories/Chain';
import ExecutionContext from '../../src/factories/ExecutionContext';

describe(`Chain`, () => {

  it(`should be a function`, (done) => {
    expect(Chain).to.be.a('function');
    done();
  });

  describe(`const chain = Chain(Object options)`, () => {

    it(`should map the middleware array to contain actual middleware functions`, (done) => {
      const middlewareFn = function () {
      };
      const chain = Chain({
        runner: {
          middleware: {
            test: middlewareFn
          }
        },
        middleware: ['test']
      });

      expect(chain.middleware[0]).to.equal(middlewareFn);

      done();
    });

    it(`should throw an error if a middleware is provided that does not exist`, (done) => {
      expect(() => {
        Chain({
          runner: {
            middleware: {}
          },
          middleware: ['test']
        });
      }).to.throw(/middleware 'test' not found/);

      done();
    });

    describe(`chain.execute(Object params, Object data, Function sync, Function destruct)`, () => {

      it(`should execute in series by default`, (done) => {
        const actualCallOrder = [];
        const chain = Chain({
          runner: {
            middleware: {
              first() {
                return new Promise(resolve => {
                  setTimeout(() => {
                    actualCallOrder.push('first');
                    resolve();
                  }, 100);
                });
              },
              second() {
                return new Promise(resolve => {
                  actualCallOrder.push('second');
                  resolve();
                });
              }
            }
          },
          middleware: ['first', 'second']
        });

        const expectedCallOrder = ['first', 'second'];

        chain.execute()
          .then(() => {
            expect(actualCallOrder).to.deep.equal(expectedCallOrder);
            done();
          });
      });

      it(`should execute parallel if parallel was is set to true in the options passed into the Chain factory`, (done) => {
        const actualCallOrder = [];
        const chain = Chain({
          runner: {
            middleware: {
              first() {
                return new Promise(resolve => {
                  setTimeout(() => {
                    actualCallOrder.push('first');
                    resolve();
                  }, 100);
                });
              },
              second() {
                return new Promise(resolve => {
                  actualCallOrder.push('second');
                  resolve();
                });
              }
            }
          },
          middleware: ['first', 'second'],
          parallel: true
        });

        const expectedCallOrder = ['second', 'first'];

        chain.execute()
          .then(() => {
            expect(actualCallOrder).to.deep.equal(expectedCallOrder);
            done();
          });
      });

      it(`should return an instance of ExecutionContext`, (done) => {
        const chain = Chain();
        expect(chain.execute()).to.be.an.instanceOf(ExecutionContext);
        done();
      });

    });

  })

});