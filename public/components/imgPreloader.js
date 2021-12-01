const queue = [];
/**
 * @class
 */
const ImgPreloader = {
  /**
   * @param {Array<string>} imgs url картинок
   */
  upload(imgs) {
    queue.push(...imgs);
    for (let i = 0; i < imgs.length; i++) {
      const img = new Image();
      img.onload = () => {
        const index = queue.indexOf(img);
        if (index !== -1) {
          queue.splice(index, 1);
        }
      };
      queue.push(img);
      img.src = imgs[i];
    }
  },
};

export default ImgPreloader;
