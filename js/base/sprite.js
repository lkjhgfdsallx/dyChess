/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(imgSrc = '', width = 0, height = 0, x = 0, y = 0, sx, sy ,swidth, sheight) {
    this.img = tt.createImage()
    this.img.src = imgSrc

    this.width = width
    this.height = height

    this.x = x
    this.y = y

    this.sx = sx
    this.sy = sy
    this.swidth = swidth
    this.sheight = sheight

    this.visible = true
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    return new Promise((resolve, reject) => {
      if (!this.visible) {
        resolve()
        return
      }

      const drawImage = () => {
        ctx.drawImage(
          this.img,
          this.sx || 0,
          this.sy || 0,
          this.swidth || this.img.width,
          this.sheight || this.img.height,
          this.x,
          this.y,
          this.width,
          this.height
        )
        resolve(this.img)
      }

      if (this.img.complete) {
        this.img.onload = drawImage
      } else {
        this.img.onload = drawImage
        this.img.onerror = reject
      }
    })
  }

  /**
   * 简单的碰撞检测定义：
   * 另一个精灵的中心点处于本精灵所在的矩形内即可
   * @param{Sprite} sp: Sptite的实例
   */
  isCollideWith(sp) {
    const spX = sp.x + sp.width / 2
    const spY = sp.y + sp.height / 2

    if (!this.visible || !sp.visible) return false

    return !!(spX >= this.x
      && spX <= this.x + this.width
      && spY >= this.y
      && spY <= this.y + this.height)
  }
}
