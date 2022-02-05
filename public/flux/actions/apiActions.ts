import {ApiAction} from '../reducers/apiReducer';
import {ApiTypes} from '../types';

// ////////////////
//    apiActions
// ////////////////

/**
 * @return {Action}
 */
 function setUnavailable(): ApiAction {
  return {
    type: ApiTypes.SET_UNAVAILABLE,
  };
}
/**
 * @return {Action}
 */
function setAvailable() {
  return {
    type: ApiTypes.SET_AVAILABLE,
  };
}

const apiActions = {
  setAvailable,
  setUnavailable,
};

export default apiActions;
