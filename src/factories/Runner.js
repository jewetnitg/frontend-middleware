import _ from 'lodash';
import FactoryFactory from 'frontend-factory';

import Chain from './Chain';
import Request from './Request';

/**
 * @todo document
 * @class Runner
 */
const Runner = FactoryFactory({

  defaults: {
    middleware: {}
  },

  initialize() {
    this.middleware = this.options.middleware;

    if (this.options.session) {
      Request.session = this.options.session;
    }
  },

  prototype: {

    /**
     * @todo document
     * @param middleware
     * @param params
     * @param data
     * @param sync
     * @param destruct
     * @returns {*|Promise}
     */
    execute(middleware = [], params = {}, data = {}, sync, destruct) {
      const chain = Chain({
        runner: this,
        middleware
      });

      return chain.execute(params, data, sync, destruct);
    },

    /**
     * @todo document
     * @todo test
     * @todo refactor?
     * @param options
     * @param fn
     * @param path
     */
    add(options = {}, fn, path = []) {
      if (typeof options === 'string' && typeof fn === 'function') {
        path.push(options);
        const pathString = path.join('.');
        if (_.get(this.middleware, pathString)) {
          throw new Error(`Can't add middleware, middleware with name '${options}' already exists`);
        }

        _.set(this.middleware, pathString, fn);

        while (path.length) path.pop();
      } else if (typeof options === 'object') {
        _.each(options, (fn, name) => {
          if (typeof fn === 'function') {
            this.add(name, fn, path);
          } else if (typeof fn === 'object') {
            this.add(fn, null, path);
          } else {
            path.push(name);
          }
        });
      }
    }

  }

});

export default Runner;