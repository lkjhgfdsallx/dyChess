import BackGround from './runtime/background'
import StartBtn from './botton/startBtn'
import CanvasScroll from './base/canvasScroll'

const ctx = canvas.getContext('2d')

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // this.restart()
    this.startPage()
  }
  startPage() {
    const that = this

    that.bg = new BackGround(ctx)

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId)

    // 清除事件监听
    canvas.removeEventListener('touchstart', this.touchHandler)

    // 绘制开始页面
    const startButton = new StartBtn(ctx)
    // const startTitle = new StartTitle(ctx)

    // 开始按钮点击事件处理逻辑
    const startButtonHandler = function (e) {
      e.preventDefault()

      const x = e.touches[0].clientX
      const y = e.touches[0].clientY

      const buttonArea = startButton.btnArea

      if (x >= buttonArea.startX && x <= buttonArea.endX && y >= buttonArea.startY && y <= buttonArea.endY) {
        startButton.removeEventListener('touchstart', startButtonHandler)
        setTimeout(() => {
          play.isPlay = true
          play.checkpoint1.playGame()
        }, 300)
      }
    }

    startButton.addEventListener('touchstart', startButtonHandler)

    // 渲染开始页面
    const renderStartPage = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      that.bg.render(ctx)
      startButton.drawToCanvas(ctx)
      // startTitle.drawToCanvas(ctx)
    }

    // 设置开始页面的帧循环
    const startPageLoop = function () {
      if (play.isPlay === true) {
        window.cancelAnimationFrame(that.aniId)
      } else {
        renderStartPage()
        that.aniId = window.requestAnimationFrame(startPageLoop, canvas)
      }
    }

    startPageLoop()
  }
  restart() {
    this.bg = new BackGround()
    this.startBtn = new StartBtn()
    this.render()
    this.touchEvent()
    this.myCanvas = new CanvasScroll(ctx, 0, 0, 'images/canvasScroll.png')
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

      if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY) {
        setTimeout(() => {
          play.isPlay = true
          play.checkpoint1.playGame()
        }, 300)
        canvas.removeEventListener('touchstart', touchStartHandler)
      }
    }
    canvas.addEventListener('touchstart', touchStartHandler)
  }
}
