/**
 * Кнопка перехода в меню
 * @return {HTMLAnchorElement}
 */
export default function createToMenuBtn() {
  const backBtn = document.createElement('a');
  backBtn.textContent = 'Назад';
  backBtn.href = '/';
  backBtn.dataset.section = 'main';
  return backBtn;
}
