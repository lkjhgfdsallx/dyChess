import Sprite from '../base/sprite'

const screenWidth = tt.getSystemInfoSync().windowWidth
const screenHeight = tt.getSystemInfoSync().windowHeight

// 相关常量设置
const IMG_SRC = 'images/startBtn.png'
const WIDTH = screenWidth / 2
const HEIGHT = WIDTH / 2.5

export default class StartBtn extends Sprite {
  constructor() {
    super(IMG_SRC, WIDTH, HEIGHT)
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight / 2 - this.height / 2
    this.swidth = 214
    this.sheight = 46

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
    ctx.font = `${parseInt(screenWidth / 12)}px Arial`
    ctx.fillText('开始游戏', this.x + (WIDTH - parseInt(screenWidth / 3)) / 2, this.y + HEIGHT - parseInt(screenWidth / 12))
  }
}
