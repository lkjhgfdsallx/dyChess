import Sprite from '../base/sprite'

const screenWidth = tt.getSystemInfoSync().windowWidth
const screenHeight = tt.getSystemInfoSync().windowHeight

// 相关常量设置
const IMG_SRC = 'images/bg.jpg'
const WIDTH = screenWidth
const HEIGHT = screenHeight

export default class BackGround extends Sprite {
  constructor() {
    super(IMG_SRC, WIDTH, HEIGHT)
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight / 2 - this.height / 2
  }
}
