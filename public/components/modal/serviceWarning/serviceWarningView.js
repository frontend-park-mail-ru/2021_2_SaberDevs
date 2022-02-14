import BaseComponentView from '../../_basic/baseComponentView';
/**
 * @class serviceWarningView
 */
export default class serviceWarningView extends BaseComponentView {
  /**
    * @return {HTMLElement}
    */
  render() {
    const box = document.createElement('div');
    box.style = `
    display: none;

    z-index: 10;
    position:fixed; 
    box-sizing: border-box;
    border-radius: 5px;
    padding: 5px;
    top: 105px;
    left: 20px;
    background-color: #dee4ea;
    color: red;
    font-weight: bold;
    `;
    return box;
  }
}
