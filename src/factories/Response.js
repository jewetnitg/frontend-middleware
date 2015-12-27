import _ from 'lodash';
import FactoryFactory from 'frontend-factory';

/**
 * @todo document
 * @type {Factory}
 */
const Response = FactoryFactory({

  factory(data = {}) {
    let syncCallbacks = [];
    let destructCallbacks = [];

    function destruct() {
      runCallbacks(destructCallbacks, null, 'stop');
      resetCallbacks();
    }

    function sync(data) {
      runCallbacks(syncCallbacks, data, 'sync');
    }

    function resetCallbacks() {
      syncCallbacks = [];
      destructCallbacks = [];
    }

    const res = {

      get destruct() {
        return destruct;
      },

      set destruct(value) {
        // @todo test
        if (value !== destruct) {
          destructCallbacks.push(value);
        }

        return value;
      },

      set sync(value) {
        // @todo test
        if (value !== sync) {
          syncCallbacks.push(value);
        }

        return value;
      },

      get sync() {
        return sync;
      },

      toObject: Response.prototype.toObject

    };

    Object.assign(res, _.omit(data, _.methods(Response.prototype)));
    Object.setPrototypeOf(res, Response.prototype);

    return res;
  },

  prototype: {

    toObject() {
      return _.omit(this, _.methods(this));
    }

  }

});

function runCallbacks(callbacks, data, propertyName) {
  _.each(callbacks, (cb) => {
    if (typeof cb === 'function') {
      cb(data);
    } else if (propertyName && cb && typeof cb[propertyName] === 'function') {
      cb[propertyName](data);
    }
  });
}

export default Response;