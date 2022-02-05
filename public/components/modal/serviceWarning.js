import ServiceWarning from './serviceWarning/serviceWarning.js';

import store from '../../flux/store';
import {ApiTypes} from '../../flux/types';

const serviceWarning = new ServiceWarning();
document.getElementById('warningroot').appendChild(serviceWarning.render());

const Warning = {
  show(msg) {
    serviceWarning.show(msg);
  },
  hide() {
    serviceWarning.hide();
  },
  setMessage(msg) {
    serviceWarning.setMessage(msg);
  },
  getMessage() {
    return serviceWarning.getMessage();
  },
  init() {
    store.subscribe(
        ApiTypes.SET_UNAVAILABLE,
        () => Warning.show('Сервис недоступен'),
    );
    store.subscribe(
        ApiTypes.SET_AVAILABLE,
        () => {
          if (Warning.getMessage() === 'Сервис недоступен') {
            Warning.setMessage('');
            Warning.hide();
          }
        },
    );
  },
};

export default Warning;
