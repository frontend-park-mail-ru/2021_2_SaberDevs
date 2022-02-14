export interface IKeyElementsMap {
  [key: string]: HTMLElement;
}

export type KeyElementsMap<T extends IKeyElementsMap> = T | null;

export default class BaseComponentView {
  keyElems: KeyElementsMap<IKeyElementsMap> = null;
  /**
    * @return {HTMLElement}
    */
  render(...props: any): HTMLElement {
    return document.createElement('div');
  }
}
