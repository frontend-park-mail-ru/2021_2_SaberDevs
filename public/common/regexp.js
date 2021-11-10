// Только буквенные латинские символы и _ числом от 4 до 20
export const login = /^[a-zA-Z][a-zA-Z0-9_]{4,20}$/;

// Любые символы числом от 8 до 256
export const password = /^\S{8,40}$/;
// '^[A-Za-z0-9.,\\/#!$%\\^&\\*;:{}=\\-_`~()]{8,40}$';
// '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){4}).{8,256}$';

// Имена не короче 2-х букв.
export const firstName = /^[a-zA-Zа-яА-Я]{2,}$/;
// Тестировалось на:
/*
Джон
Гектор
Матиас
Мартин
Ай
Чао
Элжбета
Salah
*/

// Поддерживает двойные фамилии, апострофы, дефисы.
export const lastName =
/^[a-zA-Zа-яА-Я]{1,}'?-?[a-zA-Zа-яА-Я]{1,}(\s[a-zA-Zа-яА-Я]{1,})?$/;
// Тестировалось на:
/*
Смит
Д'Ларги
Доу-Смит
д'Аррас
Лютер Кинг
Deniels
Cho-Go
ad-Din
Di Angelo
La Malfa
*/

// Аналог [а-яёА-ЯЁ]
export const cirillic = /[\u0401\u0451\u0410-\u044f]/;

const regexp = {
  login,
  password,
  firstName,
  lastName,
  cirillic,
};

export default regexp;
