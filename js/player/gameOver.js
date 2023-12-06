import Sprite from '../base/sprite'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 相关常量设置
const IMG_SRC = 'images/over.png'
const WIDTH = 295
const HEIGHT = 158

export default class GameOver extends Sprite {
  constructor(gameInfo) {
    super(IMG_SRC, WIDTH, HEIGHT)
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight / 2 - this.height / 2
    this.gameinfo = gameInfo
  }
  touchEvent(ctx, score) {
    const touchStartHandler = (e) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.gameinfo.renderGameOver(ctx, score)
      canvas.removeEventListener('touchstart', touchStartHandler)
    }
    canvas.addEventListener('touchstart', touchStartHandler)
  }
}
