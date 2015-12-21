/**
 * @author rik
 */
import _ from 'lodash';

// @todo refactor to separate file
function reqFactory(params = {}) {
  return {
    params,
    param(path) {
      return _.get(params, path);
    },
    session: MiddlewareRunner.session
  };
}

// @todo refactor to separate file
function resFactory() {
  const destruct = [];
  return {

    set destruct(cb) {
      destruct.push(cb);
    },

    get destruct() {
      return destruct;
    },

    destroy() {
      this.sync = _.noop;

      while (destruct.length) {
        const cb = destruct.pop();

        if (typeof cb.stop === 'function') {
          cb.stop();
        } else if (typeof cb === 'function') {
          cb();
        }
      }
    },

    sync() {
      throw new Error(`Can't sync, sync not implemented`);
    }
  };
}

/**
 *
 * @todo refactor to use FactoryFactory
 * @param options
 * @returns {{}}
 * @constructor
 */
function MiddlewareRunner(options = {}) {
  const middlewareRunner = {};

  _.each(options, (middlewareTypeDefinition, middlewareType) => {
    const middleware = middlewareRunner[middlewareType] = Object.create(MiddlewareRunner.prototype);
    middleware.type = middlewareType;

    _.defaults(middlewareTypeDefinition, MiddlewareRunner.defaults, {
      middleware: {}
    });

    _.extend(middleware, middlewareTypeDefinition);
  });

  return middlewareRunner;
}

/**
 *
 * @type {{req: boolean, res: boolean, parallel: boolean, extendResWithResolvedData: boolean, resFactory: resFactory, reqFactory: reqFactory}}
 */
MiddlewareRunner.defaults = {
  req: true,
  res: false,
  parallel: false,
  extendResWithResolvedData: true,
  resFactory,
  reqFactory
};

/**
 *
 * @type {{}}
 */
MiddlewareRunner.session = {};

MiddlewareRunner.prototype = {

  /**
   *
   * @param middlewareNames
   * @param data
   * @param {Object} [reqExtendObj={}] Object to extend the req object with
   * @param {Object} [resExtendObj={}] Object to extend the res object with
   */
  run(middlewareNames = [], data = {}, reqExtendObj = {}, resExtendObj = {}) {
    if (typeof middlewareNames === 'string') {
      middlewareNames = [middlewareNames];
    }

    if (this.parallel) {
      return runParallel.call(this, middlewareNames, data, reqExtendObj, resExtendObj);
    } else {
      return runSequence.call(this, middlewareNames, data, reqExtendObj, resExtendObj);
    }
  },

  /**
   *
   * @param name
   * @param middleware
   */
  add(name, middleware) {
    if (typeof name === 'string' && typeof middleware === 'function') {
      _.set(this.middleware, name, middleware);
    } else if (typeof name === 'object' && !Array.isArray(name)) {
      _.extend(this.middleware, name);
    }
  }

};

// @todo refactor
function runParallel(middlewareNames, data = {}, reqExtendObj = {}, resExtendObj = {}) {
  const promises = [];
  const req = this.req ? this.reqFactory(data) : null;
  const res = this.res ? this.resFactory() : null;

  if (this.req && reqExtendObj) {
    _.extend(req, reqExtendObj);
  }

  if (this.res && resExtendObj) {
    _.extend(res, resExtendObj);
    res.sync = res.sync || this.sync;
  }

  _.each(middlewareNames, (name) => {
    const invert = name[0] === '!';
    name = name.replace('!', '');
    const middleware = _.get(this.middleware, name);

    if (!middleware) {
      throw new Error(`${this.type} middleware with name '${name}' not defined.`);
    }

    promises.push(
      Promise.resolve()
        .then(() => {
          return middleware(req, res);
        })
        .then(data => {
          if (invert) {
            return Promise.reject();
          } else {
            return data;
          }
        }, data => {
          if (invert) {
            return Promise.resolve();
          } else {
            return Promise.reject(data);
          }
        })
    );
  });

  return Promise.all(promises);
}

// @todo refactor
function runSequence(middlewareNames, data = {}, reqExtendObj = {}, resExtendObj = {}, stateObj = false) {
  stateObj = stateObj || {
      index: 0,
      req: this.req ? this.reqFactory(data) : null,
      res: this.res ? this.resFactory() : null
    };

  if (stateObj.index === 0) {
    if (this.req && reqExtendObj) {
      _.extend(stateObj.req, reqExtendObj);
    }

    if (this.res && resExtendObj) {
      resExtendObj.sync = resExtendObj.sync || this.sync.bind(this);
      _.extend(stateObj.res, resExtendObj);
    }
  }

  if (!middlewareNames.length) {
    return Promise.resolve(stateObj.res);
  }

  const name = middlewareNames[stateObj.index].replace('!', '');
  const invert = middlewareNames[stateObj.index][0] === '!';
  const middleware = _.get(this.middleware, name);

  if (!middleware) {
    throw new Error(`${this.type} middleware with name '${name}' not defined.`);
  }

  return Promise.resolve()
    .then(() => {
      return middleware(stateObj.req, stateObj.res)
    })
    .then((data) => {
      if (invert) {
        return Promise.reject();
      } else {
        if (this.res && this.extendResWithResolvedData) {
          _.extend(stateObj.res, data);
        }

        if (middlewareNames.length - 1 === stateObj.index) {
          return Promise.resolve(stateObj.res);
        } else {
          stateObj.index++;
          return runSequence.call(this, middlewareNames, data, reqExtendObj, resExtendObj, stateObj);
        }
      }
    }, (data) => {
      if (invert) {
        return Promise.resolve();
      } else {
        return Promise.reject(data);
      }
    });
}

export default MiddlewareRunner;