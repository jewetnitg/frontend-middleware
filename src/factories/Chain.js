import _ from 'lodash';
import ExecutionContext from './ExecutionContext';

/**
 * @todo refactor to use FactoryFactory
 * @param options {Object}
 * @class Chain
 */
function Chain(options = {}) {
  const chain = Object.create(Chain.prototype);

  chain.runner = options.runner;
  chain.parallel = options.parallel || false;
  chain.options = options;
  chain.middleware = _.map(options.middleware, (middleware) => {
    const middlewareFn = _.get(options.runner.middleware, middleware);

    if (typeof middlewareFn !== 'function') {
      throw new Error(`Could not construct Chain, middleware '${middleware}' not found`);
    }

    return middlewareFn;
  });

  return chain;
}

Chain.prototype = {

  /**
   *
   * @param params
   * @param data
   * @param sync
   * @param destruct
   * @returns {*}
   */
  execute(params = {}, data = {}, sync, destruct) {
    const executionContext = ExecutionContext({
      chain: this,
      data,
      params,
      sync,
      destruct
    });

    if (this.parallel) {
      executionContext.promise = executeParallel(this.middleware, executionContext);
    } else {
      executionContext.promise = executeInSeries(this.middleware, executionContext);
    }

    return executionContext;
  }

};

function executeParallel(middleware, executionContext) {
  return Promise.all(
    _.map(middleware, fn => {
      return fn(executionContext.req, executionContext.res);
    })
  );
}

function executeInSeries(middleware, executionContext, index = 0) {
  if (middleware.length === 0) {
    return Promise.resolve(executionContext.res.toObject());
  }

  const isLast = index === middleware.length - 1;
  const fn = middleware[index];

  return Promise.resolve(fn(executionContext.req, executionContext.res))
    .then(data => {
      // merge middleware resolve data into response
      Object.assign(executionContext.res, data);

      if (!isLast) {
        return executeInSeries(middleware, executionContext, index + 1);
      }

      return executionContext.res.toObject();
    });
}

export default Chain;