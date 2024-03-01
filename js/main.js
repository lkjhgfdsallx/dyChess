import BackGround from './runtime/background'
import StartBtn from './botton/startBtn'
// import CanvasScroll from './base/canvasScroll'
import AvatarTags from './botton/avatarTags'
import StaminaBtn from './botton/staminaBtn'

const ctx = canvas.getContext('2d')

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // this.restart()
    this.login()
    this.startPage()
  }
  login() {
    tt.checkSession({
      success() {
        console.log(`session 未过期`)
      },
      fail() {
        console.log(`session 已过期，需要重新登录`)
        tt.login({
          success: (res) => {
            console.log("登录成功", res)
            tt.getUserInfo({
              // withCredentials: true,
              // withRealNameAuthenticationInfo: true,
              success(res) {
                const userInfo = res.userInfo
                console.log(`getUserInfo 调用成功`, res.userInfo)
                tt.setStorage({
                  key: "userInfo",
                  data: userInfo,
                  success(res) {
                    console.log(`set seen ad flag`, res)
                  },
                  fail(res) {
                    console.log(`setStorage调用失败`)
                    tt.navigateToScene({
                      scene: "sidebar",
                      success: (res) => {
                        console.log("navigate to scene success");
                        // 跳转成功回调逻辑
                      },
                      fail: (res) => {
                        console.log("navigate to scene fail: ", res);
                        // 跳转失败回调逻辑
                      },
                    })
                  },
                })
              },
              fail(res) {
                console.log(`getUserInfo 调用失败`, res.errMsg)
              },
            })

          },
          fail: (err) => {
            console.log("登录失败", err)
          },
        })
      },
    })
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
    const avatarTags = new AvatarTags(ctx)
    const staminaBtn = new StaminaBtn(ctx)
    // const startTitle = new StartTitle(ctx)

    // 开始按钮点击事件处理逻辑
    const startButtonHandler = function (e) {
      e.preventDefault()

      const x = e.changedTouches[0].clientX
      const y = e.changedTouches[0].clientY

      const buttonArea = startButton.btnArea

      if (x >= buttonArea.startX && x <= buttonArea.endX && y >= buttonArea.startY && y <= buttonArea.endY) {
        startButton.removeEventListener('touchend', startButtonHandler)
        setTimeout(() => {
          play.isPlay = true
          play.checkpoint1.playGame()
        }, 300)
      }
    }

    startButton.addEventListener('touchend', startButtonHandler)

    // 渲染开始页面
    const renderStartPage = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      that.bg.render(ctx)
      startButton.drawToCanvas(ctx)
      avatarTags.drawToCanvas(ctx)
      staminaBtn.drawToCanvas(ctx)
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
}
