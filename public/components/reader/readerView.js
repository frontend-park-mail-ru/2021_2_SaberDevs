import BaseComponentView from '../_basic/baseComponentView.js';
import articleReaderComponent from '../reader/articleReader.pug.js';
import commentComponent from '../comment/comment.pug.js';

/**
 * @class ReaderView
 */
export default class ReaderView extends BaseComponentView {
  /**
   * Компонент редактора
   */
  constructor() {
    super();
  }

  /**
   * Задать содержание статьи
   * @param {Object} article
   * @property {string} title
   * @property {string} text
   * @property {Array<string>} tags
   * @property {string} datetime
   * @property {Object} author
   * @property {number} likes
   * @property {number} comments
   * @return {HTMLElement}
   */
  render(article) {
    const reader = document.createElement('div');
    reader.innerHTML = articleReaderComponent(article);

    const commentBtn = reader
        .getElementsByClassName('article-view__send-comment-btn')[0];
    console.log('commentBtn:', commentBtn);
    commentBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('click commentbtn');
      const input = document.querySelector('.article-view__comment-input');
      if (input.value != '') {
        const comments = document.querySelector('#comments');
        const comment = commentComponent({
          text: input.value,
        });
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comments__comment';
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = comment;
        comments.appendChild(commentDiv);
      }
    });

    return reader.firstChild;
  }
}
