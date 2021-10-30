// про requestAnimationFrame:
// https://developer.mozilla.org/ru/docs/Web/API/window/requestAnimationFrame
// о важности performace now()
// https://coderoad.ru/21316084/requestAnimationFrame-что-именно-такое-timestamp
// про прогресс-бар
// https://html-plus.in.ua/use-progress-element-in-css-js/

const SPEED_MIN_LIMIT = 100;  // 1000 frames ~ 10% of progress
const INITIAL_SPEED = 400;  // 1000 frames ~ 40% of progress
const PROGRESS_STOP_AT = 75;  // %
const SPEED_ON_END = 1000;  // 1000 frames ~ 100% of progress

/**
 * @class LoadingPage
 * @module LoadingPage
 */
export default class LoadingPage {
  /**
  * фон во время загрузки приложения
  */
  constructor() {
    this.progressValue = 0;
    this.root = document.createElement('div');
    this.root.className = 'background';
    // TODO: нормальные стили по БЭМу. Смотреть ссылки выше
    this.root.innerHTML = `
      <h1 style="font-size: 5rem; display: flex;">Загрузка</h1>
      <progress value="${this.progressValue}" max="100"
      class="progress__loading">
      </progress>
    `;
    this.progressBar = this.root.querySelector('progress');
  }

  /**
   * Начать продвижение загрузки
   */
  async start() {
    const root = document.getElementById('root');
    root.innerHTML = '';
    root.appendChild(this.root);

    let prevTimestamp = performance.now();
    let speed = INITIAL_SPEED;

    const step = (timestamp) => {
      this.progressValue += (timestamp - prevTimestamp) * speed / 10000;
      prevTimestamp = timestamp;
      if (this.progressValue < PROGRESS_STOP_AT) {
        speed--;
        if (speed < SPEED_MIN_LIMIT) {
          speed = SPEED_MIN_LIMIT;
        }
        this.progressBar.value = this.progressValue;
        window.requestAnimationFrame(step);
      }
    };

    // начать анимацию
    window.requestAnimationFrame(step);
  }

  /**
   * Довести прогресс-бар до конца
   */
  async end() {
    await new Promise((resolve) => {
      let prevTimestamp = performance.now();

      const step = (timestamp) => {
        this.progressValue += (timestamp - prevTimestamp) *SPEED_ON_END / 10000;
        console.log(this.progressValue);
        prevTimestamp = timestamp;
        if (this.progressValue < 100) {
          this.progressBar.value = this.progressValue;
          window.requestAnimationFrame(step);
        } else {
          resolve();
        }
      };

      // начать анимацию
      step(performance.now());
    });

    // убрать за собой
    const root = document.getElementById('root');
    root.innerHTML = '';
  }
}
