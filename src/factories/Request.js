import _ from 'lodash';
import FactoryFactory from 'frontend-factory';

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
    param(key) {
      return _.get(this.params, key);
    }
  }

});

Request.session = {};

export default Request;