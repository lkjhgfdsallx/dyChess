import BackGround from './runtime/background'
import Popup from './base/popup'
import AvatarTags from './botton/avatarTags'
import StaminaBtn from './botton/staminaBtn'

const ctx = canvas.getContext('2d')
ctx.imageSmoothingQuality = 'high'

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.isExist = false
    this.login()
    this.navigateToScene()
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
  navigateToScene() {
    tt.onShow((res) => {
      if ((res.scene != '021001' && res.scene != '021036' && res.scene != '101001' && res.scene != '101036') || !res.scene) {
        tt.checkScene({
          scene: "sidebar",
          success: (res) => {
            if ((res.isExist && res.isExist === true) || !res.isExist) {
              this.isExist = true
            }
          }
        })
      } else {
        this.isExist = false
      }
    })
  }
  startPage() {
    const that = this

    that.bg = new BackGround(ctx)
    that.popup = new Popup({
      x: tt.getSystemInfoSync().windowWidth * 0.085,
      y: tt.getSystemInfoSync().windowHeight * 0.135,
      width: tt.getSystemInfoSync().windowWidth * 0.83,
      height: tt.getSystemInfoSync().windowWidth * 0.83 * 1.566,
      text: '',
      image: 'images/screenshot.png'
    })

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId)

    // 清除事件监听
    canvas.removeEventListener('touchstart', this.touchHandler)

    // 绘制开始页面
    const startButton = new StartBtn(ctx)
    const avatarTags = new AvatarTags(ctx)
    const staminaBtn = new StaminaBtn(ctx)

    // 渲染开始页面
    const renderStartPage = function () {
      ctx.clearRect(0, 0, tt.getSystemInfoSync().windowWidth, tt.getSystemInfoSync().windowHeight);

      that.bg.render(ctx)
      startButton.drawToCanvas(ctx)
      avatarTags.drawToCanvas(ctx)
      staminaBtn.drawToCanvas(ctx)
      that.popup.renderOnCanvas(ctx)
      if (that.isExist === true) {
        avatarTags.drawRuKoYouJiang(ctx)
        const navigateToSceneHandler = function (e) {
          if (this.lastCollisionTime === undefined) {
            this.lastCollisionTime = Date.now()
          } else {
            if (Date.now() - this.lastCollisionTime < 500) {
              return
            }
            this.lastCollisionTime = Date.now()
          }
          e.preventDefault()

          const x = e.changedTouches[0].clientX
          const y = e.changedTouches[0].clientY

          const buttonArea = avatarTags.btnArea

          if (that.isExist === true && !that.popup.visible && x >= buttonArea.startX && x <= buttonArea.endX && y >= buttonArea.startY && y <= buttonArea.endY) {
            avatarTags.removeEventListener('touchend', navigateToSceneHandler)

            that.popup.show()
            return
          }

          if (that.isExist === true && that.popup.visible && !that.popup.isInside(x, y)) {
            that.popup.hide()
            startButton.touchEndHandled = false
          }

          if (that.isExist === true && that.popup.visible && that.popup.isInside(x, y)) {
            that.popup.hide()
            tt.navigateToScene({
              scene: "sidebar",
              success: (res) => {
                play.stamina.staminaAdd(10)
                play.stamina.setStorage()
                startButton.touchEndHandled = false
              },
              fail: (res) => {
                console.log("navigate to scene fail: ", res)
                // 跳转失败回调逻辑
              },
            })
          }
        }

        avatarTags.addEventListener('touchend', navigateToSceneHandler)
      }
      if (that.isExist === true && that.popup.visible) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(0, 0, tt.getSystemInfoSync().windowWidth, tt.getSystemInfoSync().windowHeight)
        startButton.touchEndHandled = true
      }
      that.popup.renderOnCanvas(ctx)
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
