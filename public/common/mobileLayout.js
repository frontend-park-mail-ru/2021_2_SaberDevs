export const mobileLayoutConstants = {
  phone: {
    maxWidth: 400,
  },
  tablet: {
    maxWidth: 900,
  },
  PC: {

  },
};

/**
 * @class
 */
class MobileLayoutUtils {
  /**
   * Производит Media Query по ширине экрана
   * Настройки в файле mobileLayout.js
   * @return {boolean}
   */
  static isDevicePhone() {
    return window.matchMedia(
        `(max-width: ${mobileLayoutConstants.phone.maxWidth}px)`,
    ).matches;
  }

  /**
   * Производит Media Query по ширине экрана
   * Настройки в файле mobileLayout.js
   * @return {boolean}
   */
  static isDeviceTablet() {
    return window.matchMedia(
        `(max-width: ${mobileLayoutConstants.tablet.maxWidth}px)`,
    ).matches;
  }

  /**
   * Производит Media Query по ширине экрана
   * Настройки в файле mobileLayout.js
   * @return {boolean}
   */
  static isDevicePC() {
    return window.matchMedia(
        `(min-width: ${mobileLayoutConstants.tablet.maxWidth + 1}px)`,
    ).matches;
  }
}

export default MobileLayoutUtils;
