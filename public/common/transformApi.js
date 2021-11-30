import {getRusDateTime} from './utils.js';
import Ajax from '../modules/ajax.js';

/**
 * @param {object} obj
 */
export function appendApiImg(obj) {
  if ('avatarUrl' in obj && !obj.avatarUrl.startsWith(Ajax.APIurl)) {
    obj.avatarUrl = Ajax.APIurl + '/img/' + obj.avatarUrl+'fuck';
  }
  if ('previewUrl' in obj && !obj.previewUrl.startsWith(Ajax.APIurl)) {
    obj.previewUrl = Ajax.APIurl + '/img/' + obj.previewUrl;
  }
};

/**
 * @param {string} datetime
 * @return {number}
 */
function translateServerDateToMS(datetime) {
  // привожу 2021/11/23 13:13 к ISO 8601
  // https://ru.wikipedia.org/wiki/ISO_8601
  return Date.parse(
      datetime.replaceAll('/', '-').replace(' ', 'T') + ':00',
  );
}

/**
 * преобразует комментарии из формата сервера в формат,
 * приемлимый для readerReducer
 * @param {ServerComment} commentServer
 * @param {User?} author
 * @return {Comment}
 */
export function translateServerComment(commentServer, author = null) {
  const commentClient = {
    ...commentServer,
    datetimeMS: translateServerDateToMS(commentServer.dateTime),
    datetime: getRusDateTime(
        translateServerDateToMS(commentServer.dateTime),
    ),
  };

  delete commentClient.dateTime;

  appendApiImg(commentClient.author);

  if (author) {
    commentClient.author = author;
  }

  return commentClient;
}
