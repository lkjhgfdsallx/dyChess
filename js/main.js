import BackGround from './runtime/background'
import StartBtn from './botton/startBtn'

const ctx = canvas.getContext('2d')
ctx.fillStyle = '#000000'
ctx.fillRect(0, 0, tt.getSystemInfoSync().windowWidth, tt.getSystemInfoSync().windowHeight)

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.restart()
  }
  restart() {
    this.bg = new BackGround()
    this.startBtn = new StartBtn()
    this.render()
    this.touchEvent()
  }
  async render() {
    await this.bg.drawToCanvas(ctx)
    await this.startBtn.drawToCanvas(ctx)
    this.startBtn.drawText(ctx)
  }
  touchEvent() {
    const touchStartHandler = (e) => {
      e.preventDefault()
      const x = e.touches[0].clientX
      const y = e.touches[0].clientY

      const area = this.startBtn.btnArea

      // if (x >= area.startX
      //   && x <= area.endX
      //   && y >= area.startY
      //   && y <= area.endY) {
      //   setTimeout(() => {
      //     console.log('开始游戏')
      //   }, 300)
      //   canvas.removeEventListener('touchstart', touchStartHandler)
      // }
      console.log(x, y, area, x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY)
    }
    canvas.addEventListener('touchstart', touchStartHandler)
  }
}
