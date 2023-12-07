import BackGround from './runtime/background'

let canvas = tt.createCanvas()
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
    this.render()
  }
  render() {
    this.bg.drawToCanvas(ctx)
  }

  // 重新开始按钮点击事件
  // touchEvent() {
  //   const touchStartHandler = (e) => {
  //     if (this.gameinfo.clickEvent === true) {
  //       e.preventDefault()
  //       const x = e.touches[0].clientX
  //       const y = e.touches[0].clientY

  //       const area = this.gameinfo.btnArea

  //       if (x >= area.startX
  //         && x <= area.endX
  //         && y >= area.startY
  //         && y <= area.endY) {
  //         this.gameinfo.closeClick()
  //         setTimeout(() => {
  //           this.restart()
  //         }, 300)
  //         canvas.removeEventListener('touchstart', touchStartHandler)
  //       }
  //     }
  //   }
  //   canvas.addEventListener('touchstart', touchStartHandler)
  // }
}
