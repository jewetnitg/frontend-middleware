import _ from 'lodash';
import FactoryFactory from 'frontend-factory';

/**
 * @todo document
 * @type {Factory}
 */
const Request = FactoryFactory({

  props(params) {
    return {
      params: {
        value: params || {}
      },
      session: {
        value: Request.session || {}
      }
    };
  },

  prototype: {
    /**
     * @todo document
     * @param key
     * @returns {String|undefined}
     */
    param(key) {
      return _.get(this.params, key);
    }
  }

});

// @todo refactor to defaults
Request.session = {};

export default Request;