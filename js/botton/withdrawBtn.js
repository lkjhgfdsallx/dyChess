import Sprite from '../base/sprite'

const screenWidth = tt.getSystemInfoSync().windowWidth
const screenHeight = tt.getSystemInfoSync().windowHeight

// 相关常量设置
const IMG_SRC = 'images/withdrawBtn.png'
const WIDTH = screenWidth / 4
const HEIGHT = WIDTH / 2.5

export default class WithdrawBtn extends Sprite {
  constructor() {
    super(IMG_SRC, WIDTH, HEIGHT)
    this.x = com.centreX
    this.y = com.centreY + 25

    /**
    * 按钮区域
    * 简易判断按钮点击
    */
    this.btnArea = {
      startX: this.x,
      startY: this.y,
      endX: this.x + this.width,
      endY: this.y + this.height
    }
  }
  drawText(ctx) {
    ctx.fillStyle = '#ffffff'
    ctx.font = `${parseInt(WIDTH / 6)}px Arial`
    ctx.fillText('悔棋', this.x + (WIDTH - parseInt(screenWidth / 3)) / 2, this.y + HEIGHT - parseInt(screenWidth / 12))
  }
}
