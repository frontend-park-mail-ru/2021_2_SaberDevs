import loadingComponent from '../components/loading/loading.pug.js';

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
    this.root.innerHTML = loadingComponent({
      progressValue: this.progressValue,
    });
    this.progressBar = this.root.querySelector('progress');
    this.animationId = 0;
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
    this.animationId = window.requestAnimationFrame(step);
  }

  /**
   * Довести прогресс-бар до конца
   */
  async end() {
    // остановить анимацию, если еще идет
    window.cancelAnimationFrame(this.animationId);

    await new Promise((resolve) => {
      let prevTimestamp = performance.now();

      const step = (timestamp) => {
        this.progressValue += (timestamp - prevTimestamp) *SPEED_ON_END / 10000;
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
