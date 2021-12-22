import BaseComponent from '../_basic/baseComponent.js';
import LikesView from './likesView.js';

import store from '../../flux/store.js';
import Ajax from '../../modules/ajax.js';
import ModalTemplates from '../modal/modalTemplates.js';

import {ajaxDebug} from '../../globals.js';

const likeAnimationDuration = 800;
const colorInitial = '#dee4ea';
const redRubyColor = '#900603'; // red ruby
const greedGreenColor = '#597d36'; // green

/**
 * @class Likes
 */
export default class Likes extends BaseComponent {
  /**
   * @param {number} type 0 - article | 1 - comment
   * @param {number} id id объекта СТРОКОВЫЙ (под like API)
   * @param {number} likes текущее число лайков
   * @param {number} liked оценка текущего пользователя
   * @param {function} dispatchLike
   * Окошко со стрелочками для оценки
   */
  constructor(type, id, likes, liked, dispatchLike) {
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

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render(this.likes, this.liked);

    const likesNum = this.root.querySelector('#likesNum');
    const dislikeBtn = this.root.querySelector('.action-btns__dislike-icon');
    const likeBtn = this.root.querySelector('.action-btns__likes-icon');

    this.root.querySelector('.action-btns__likes-icon').addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!store.getState().authorization.isAuthenticated) {
            ModalTemplates.signup(false);
            return;
          }

          const sign = this.liked === 1 ? 0 : 1;

          likesNum.textContent = (this.likes + (sign ? 1 : -1)) + '';
          likesNum.style.color = sign === 0 ? redRubyColor : greedGreenColor;
          setTimeout(
              () => likesNum.style.color = colorInitial,
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
              .then((newLikesNum) => {
                newLikesNum = parseInt(newLikesNum, 10);
                this.dispatchLike(body.id, body.sign, newLikesNum);
                console.warn('Успешно', this.liked === 1 ? 'отменил':'лайкнул');
                if (!newLikesNum || newLikesNum === '0') {
                  likesNum.textContent = ' ';
                } else {
                  likesNum.textContent = newLikesNum;
                }
                this.likes = newLikesNum;
                this.liked = sign;
                if (sign === 1) {
                  dislikeBtn.classList.remove('action-btns__liked');
                  likeBtn.classList.add('action-btns__liked');
                } else {
                  likeBtn.classList.remove('action-btns__liked');
                }
              })
              .catch(({message}) => {
                if (ajaxDebug) {
                  console.warn(message);
                }
                likesNum.textContent = this.likes || ' ';
              });
        });

    this.root.querySelector('.action-btns__dislike-icon').addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!store.getState().authorization.isAuthenticated) {
            ModalTemplates.signup(false);
            return;
          }

          const sign = this.liked === -1 ? 0 : -1;

          likesNum.textContent = (this.likes + (sign ? -1 : 1)) + '';
          likesNum.style.color = sign === 0 ? greedGreenColor : redRubyColor;
          setTimeout(
              () => likesNum.style.color = colorInitial,
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
              .then((newLikesNum) => {
                newLikesNum = parseInt(newLikesNum, 10);
                this.dispatchLike(body.id, body.sign, newLikesNum);
                console.warn('Успешно', this.liked === -1 ? 'отменил диз':
                'диз-лайкнул (за шо)');
                likesNum.textContent = newLikesNum;
                this.likes = newLikesNum;
                this.liked = sign;
                if (sign === -1) {
                  likeBtn.classList.remove('action-btns__liked');
                  dislikeBtn.classList.add('action-btns__liked');
                } else {
                  dislikeBtn.classList.remove('action-btns__liked');
                }
              })
              .catch(({message}) => {
                if (ajaxDebug) {
                  console.warn(message);
                }
                likesNum.textContent = this.likes || ' ';
              });
        });

    return this.root;
  }

  /**
   * заменяет диваk с data-inplace = "place-for-likes" на дивак с кнопками
   * лайков и дизов
   * @param {HTMLElement} root
   */
  mountInPlace(root) {
    const likesReplaced = root
        .querySelector('[data-inplace="place-for-likes"]');
    likesReplaced?.parentElement.replaceChild(this.render(), likesReplaced);
  }
}
