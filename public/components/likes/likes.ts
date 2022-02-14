import BaseComponent from '../_basic/baseComponent';
import LikesView from './likesView';

import store from '../../flux/store';
import Ajax from '../../modules/ajax';
import ModalTemplates from '../modal/modalTemplates.js';

import {ajaxDebug} from '../../globals';

import {KeyElementsMapLikes, RatableInstances} from './LikesView';
import {RateToSrvr, Rate, Rates} from '../../common/types';

const likeAnimationDuration = 800;
const colorInitial = '#dee4ea';
const redRubyColor = '#900603'; // red ruby
const greedGreenColor = '#597d36'; // green

/**
 * @class Likes
 */
export default class Likes extends BaseComponent {
  view: LikesView;
  type: RatableInstances;
  id: number;
  likes: number;
  liked: Rate;
  dispatchLike: (id: number, sign: RateToSrvr, newLikesNum: number) => void;

  /**
   * @param {number} type 0 - article | 1 - comment
   * @param {number} id id объекта СТРОКОВЫЙ (под like API) // TODO: уточнить
   * @param {number} likes текущее число лайков
   * @param {number} liked оценка текущего пользователя -1, 0 или 1
   * @param {Function} dispatchLike
   * Окошко со стрелочками для оценки
   */
  constructor(type: RatableInstances, id: number, likes: number, liked: Rate, dispatchLike: (id: number, sign: RateToSrvr, newLikesNum: number) => void) {
    super();
    this.view = new LikesView();
    Object.assign(this, {
      type,
      id,
      likes,
      liked,
      dispatchLike,
    });
  }

  get keyElems(): KeyElementsMapLikes {
    return this.view.keyElems;
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render(): HTMLElement {
    super.render();
    this.root = this.view.render(this.likes, this.liked);

    if (!this.keyElems) {
      return document.createElement('div');
    }

    this.keyElems.likeBtn.addEventListener(
        'click',
        (e: Event) => {
          e.preventDefault();
          e.stopPropagation();

          if (!store.getState().authorization.isAuthenticated) {
            ModalTemplates.signup(false);
            return;
          }

          // 0 - отмена лайка
          // 1 - поставил
          const sign = this.liked === Rates.like ? Rates.dislike : Rates.like;

          this.keyElems.likesNum.textContent = (this.likes + sign) + '';
          this.keyElems.likesNum.style.color = sign === Rates.dislike ? redRubyColor : greedGreenColor;
          setTimeout(
              () => this.keyElems.likesNum.style.color = colorInitial,
              likeAnimationDuration,
          );

          const body = {
            type: this.type, // 0 - article, 1 - comment
            sign,
            id: this.id,
          };

          Ajax.post({
            url: `/like`,
            body,
          })
              .then(({status, response}) => new Promise((resolve, reject) => {
                if (status === Ajax.STATUS.ok) {
                  resolve(response.data);
                } else {
                  reject(new Error(response.msg));
                }
              }))
              .then((newLikesNumStr: string) => { // TODO: API fix
                const newLikesNum: number = parseInt(newLikesNumStr, 10);
                this.dispatchLike(body.id, body.sign, newLikesNum);
                console.warn('Успешно', this.liked === Rates.like ? 'отменил' : 'лайкнул');
                // TODO: check after api fix
                // if (!newLikesNum || newLikesNum === '0') {
                if (newLikesNum === 0) {
                  this.keyElems.likesNum.textContent = ' ';
                } else {
                  this.keyElems.likesNum.textContent = newLikesNum + '';
                }
                this.likes = newLikesNum;
                this.liked = sign;
                if (sign === Rates.like) {
                  this.keyElems.dislikeBtn.classList.remove('action-btns__liked');
                  this.keyElems.likeBtn.classList.add('action-btns__liked');
                } else {
                  this.keyElems.likeBtn.classList.remove('action-btns__liked');
                }
              })
              .catch(({message}) => {
                if (ajaxDebug) {
                  console.warn(message);
                }
                this.keyElems.likesNum.textContent = this.likes + '' || ' ';
              });
        });

    this.keyElems.dislikeBtn.addEventListener(
        'click',
        (e: Event) => {
          e.preventDefault();
          e.stopPropagation();

          if (!store.getState().authorization.isAuthenticated) {
            ModalTemplates.signup(false);
            return;
          }

          const sign = this.liked === Rates.like ? Rates.like : Rates.dislike;

          this.keyElems.likesNum.textContent = (this.likes + Rates.like) + '';
          this.keyElems.likesNum.style.color = sign === Rates.like ? greedGreenColor : redRubyColor;
          setTimeout(
              () => this.keyElems.likesNum.style.color = colorInitial,
              likeAnimationDuration,
          );

          const body = {
            type: this.type, // 0 - article, 1 - comment
            sign,
            id: this.id,
          };

          Ajax.post({
            url: `/like`,
            body,
          })
              .then(({status, response}) => new Promise((resolve, reject) => {
                if (status === Ajax.STATUS.ok) {
                  resolve(response.data);
                } else {
                  reject(new Error(response.msg));
                }
              }))
              .then((newLikesNumStr : string) => {
                const newLikesNum: number = parseInt(newLikesNumStr, 10);
                this.dispatchLike(body.id, body.sign, newLikesNum);
                console.warn('Успешно', this.liked === Rates.dislike ? 'отменил диз':
                'диз-лайкнул (за шо)');
                this.keyElems.likesNum.textContent = newLikesNum + '';
                this.likes = newLikesNum;
                this.liked = sign;
                if (sign === -1) {
                  this.keyElems.likeBtn.classList.remove('action-btns__liked');
                  this.keyElems.dislikeBtn.classList.add('action-btns__liked');
                } else {
                  this.keyElems.dislikeBtn.classList.remove('action-btns__liked');
                }
              })
              .catch(({message}) => {
                if (ajaxDebug) {
                  console.warn(message);
                }
                this.keyElems.likesNum.textContent = this.likes + '' || ' ';
              });
        });

    return this.root;
  }

  /**
   * заменяет диваk с data-inplace = "place-for-likes" на дивак с кнопками
   * лайков и дизов
   * @param {HTMLElement} root
   */
  mountInPlace(root: HTMLElement) {
    const likesReplaced = <HTMLDivElement> root
        .querySelector('div[data-inplace="place-for-likes"]');
    if (!likesReplaced) {
      console.warn(`{Likes} no place prepared for Likes component
      // div[data-inplace="place-for-likes"] // is requried`);
      return;
    }
    likesReplaced.parentElement.replaceChild(this.render(), likesReplaced);
  }
}
