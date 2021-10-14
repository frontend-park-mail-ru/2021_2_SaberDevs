/**
 * Кнопка перехода в меню
 * @return {HTMLAnchorElement}
 */
export default function createToMenuBtn() {
  const backBtn = document.createElement('a');
  backBtn.textContent = 'Назад';
  backBtn.href = '/';
  return backBtn;
}
