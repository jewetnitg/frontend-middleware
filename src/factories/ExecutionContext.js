import FactoryFactory from 'frontend-factory';

import Request from './Request';
import Response from './Response';

/**
 * @class ExecutionContext
 */
const ExecutionContext = FactoryFactory({

  initialize() {
    this.chain = this.options.chain;
    this.req = Request(this.options.params);
    this.res = Response(this.options.data);

    if (typeof this.options.sync === 'function') {
      this.res.sync = this.options.sync;
    }

    if (this.options.destruct) {
      this.res.destruct = this.options.destruct;
    }
  },

  prototype: {

    /**
     * Destroys the current execution context, runs the methods assigned to res.destruct, makes sure res.sync functions stop being called.
     *
     * @method destroy
     * @memberof ExecutionContext
     * @instance
     * @example
     * executionContext.destroy();
     */
    destroy() {
      this.res.destruct();
    },

    /**
     * Calls this.promise.then with the arguments provided.
     *
     * @method then
     * @memberof ExecutionContext
     * @instance
     * @example
     * executionContext
     *   .then(
     *     (res) => {
     *       ...
     *     },
     *     (err) => {
     *       ...
     *     }
     *   );
     */
    then(onFulfilled, onRejected) {
      return this.promise.then(onFulfilled, onRejected);
    },

    /**
     * Calls this.promise.catch with the arguments provided.
     *
     * @method catch
     * @memberof ExecutionContext
     * @instance
     * @example
     * executionContext
     *   .catch((err) => {
     *     ...
     *   });
     */
    catch(onRejected) {
      return this.promise.catch(onRejected);
    }
  }
});

export default ExecutionContext;