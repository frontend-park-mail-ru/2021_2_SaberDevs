import BasePageView from './basePageView.js';
import createPage from './_createPage.js';
import articleViewComponent from
  '../components/articleView/articleView.pug.js';
import commentComponent from '../components/comment/comment.pug.js';
// import formSettingsTextareaComponent from
//   '../components/settings/formSettingsTextarea.pug.js';
// import formSettingsRowComponent from
//   '../components/settings/formSettingsRow.pug.js';

// import {genRanHex} from '../utils.js';

// ///////////////////////////////// //
//
//              Article Page
//
// ///////////////////////////////// //

/**
 * Страница содержит главный компонент - редактор статьи.
 * @class ArticlePageView
 */
export default class ArticlePageView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
  }

  /**
    * Перерисовать главную страницу
    * @param {Object} existingArticle
    * @property {String} text
    * @property {Array<string>} tags
    */
  render(existingArticle) {
    super.render();
    // let articleRows = '';
    // const title = formSettingsRowComponent({
    //   label: 'Заголовок',
    //   type: 'text',
    //   name: 'title',
    //   placeholder: 'Введите заголовок статьи',
    //   pattern: '',
    //   value: existingArticle.title || '',
    // });
    // articleRows += title;
    // const text = formSettingsTextareaComponent({
    //   label: 'Текст статьи',
    //   name: 'text',
    //   placeholder: '',
    //   value: existingArticle.text || '',
    // });
    // articleRows += text;

    // const tagsBox = document.createElement('div');
    // existingArticle.tags.forEach((tag) => {
    //   const tagDiv = document.createElement('div');
    //   tagDiv.className = 'tags__tag';
    //   tagDiv.innerHTML = tag;
    //   tagDiv.style.color = 'white';
    //   tagDiv.style.backgroundColor = '#' + genRanHex();
    //   tagsBox.appendChild(tagDiv);
    // });

    // const editor = document.createElement('div');
    // editor.innerHTML = articleCreateComponent({
    //   form_rows: articleRows,
    //   tags: tagsBox.innerHTML,
    // });

    // const addTag
    // = editor.getElementsByClassName('article-create__add-tag')[0];
    // console.log('add tag: ', addTag);
    // addTag.addEventListener('click', (e) => {
    //   console.log('clickkkk');
    //   e.preventDefault();
    //   const tags
    // = document.getElementsByClassName('article-create__tags')[0];
    //   const inputTag = document
    //       .getElementsByClassName('article-create__input-tag')[0];
    //   if (inputTag.value) {
    //     const tagDiv = document.createElement('div');
    //     tagDiv.className = 'tags__tag';
    //     tagDiv.classList.add('article-create__tag');
    //     tagDiv.innerHTML = inputTag.value;
    //     tagDiv.style.color = 'white';
    //     tagDiv.style.backgroundColor = '#' + genRanHex();
    //     // tagDiv.addEventListener('click', (e) => {
    //     //   console.log('click tag');
    //     //   e.preventDefault();
    //     // });
    //     tags.appendChild(tagDiv);
    //   }
    // });
    let commentsContent = '';
    const comment = commentComponent({
      authorName: 'Петр Иванов',
      time: '10:10 07.11.2021',
      likes: 23,
      authorAvatar: '../static/img/users/user.jpg',
      text: `Очень интересная статья! Всегда хотелось 
      узнать о том, как сделать свою работу эффективной. 
      Здесь описаны все методы, которые помогут мне в этом `,
    });
    commentsContent += comment;
    commentsContent += comment;
    commentsContent += comment;

    const editor = document.createElement('div');
    editor.innerHTML = articleViewComponent({
      authorName: 'Артур Габриелян',
      time: '10:08 07.11.2021',
      title: '7 Skills of Highly Effective Programmers',
      likes: 21,
      comments: 7,
      commentsContent: commentsContent,
      picture: '../static/img/cards/conference-room-768441_1920.jpg',
      tags: ['Программирование', 'IT-Новости'],
      text: `I first read Stephen Covey’s book, The 7 Habits of Highly 
      Effective People, in my early twenties. It’s a great, 
      thought-provoking book that tries to simplify life’s biggest 
      questions and challenges into a handful of practices and principles. 
      Could the application of these habits make us more I first read 
      Stephen Covey’s book, The 7 Habits of Highly Effective People, 
      in my early twenties. It’s a great, thought-provoking book that 
      tries to simplify life’s biggest questions and challenges into 
      a handful of practices and principles. 
      Could the application of these habits make us more 
      productive programmers? This is a question I `,
    });

    this.root.appendChild(createPage(editor.firstChild));
  }

  /**
   * Отобразить подконтрольную страницу.
   * @param {Object} existingArticle
   * @property {String} text
   * @property {Array<string>} tags
   */
  show(existingArticle) {
    this.root.hidden = false;
    this.render(existingArticle);
  }
}

