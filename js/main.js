import BackGround from './runtime/background'
import Popup from './base/popup'
import AvatarTags from './botton/avatarTags'
import StaminaBtn from './botton/staminaBtn'
import BackTag from './botton/backTag'

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
    this.startView()
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
  startView() {
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

    const startView = new StartView(ctx)
    const avatarTags = new AvatarTags(ctx)
    const staminaBtn = new StaminaBtn(ctx)

    const startButtonHandler = function (e) {
      if (this.lastCollisionTime2 === undefined) {
        this.lastCollisionTime2 = Date.now()
      } else {
        if (Date.now() - this.lastCollisionTime2 < 500) {
          return
        }
        this.lastCollisionTime2 = Date.now()
      }
      e.preventDefault()

      const x = e.changedTouches[0].clientX
      const y = e.changedTouches[0].clientY

      const buttonArea = staminaBtn.btnArea

      if (x >= buttonArea.startX && x <= buttonArea.endX && y >= buttonArea.startY && y <= buttonArea.endY && play.isPlay !== true) {
        staminaBtn.removeEventListener('touchend', startButtonHandler)
        setTimeout(() => {
          let paramsButton
          let params2Button
          let params3Button
          let params = {
            type: "image",
            image: "images/zhedangse.png",
            style: {
              left: 0,
              top: 0,
              width: tt.getSystemInfoSync().windowWidth,
              height: tt.getSystemInfoSync().windowHeight
            },
            success(button) {
              paramsButton = button
              function button_tap(res) {
                logger.log("1button_tap:" + res.buttonid)
                // button.hide();
                // button.offTap(button_tap);
                // button.destroy();
              }
              button.onTap(button_tap)
            },
            fail(res) {
              console.log("创建失败", res.errMsg)
            },
          }
          let params2 = {
            type: "image",
            image: "images/hdtl.png",
            style: {
              left: (tt.getSystemInfoSync().windowWidth - tt.getSystemInfoSync().windowWidth / 1.5) * 0.5,
              top: (tt.getSystemInfoSync().windowHeight - tt.getSystemInfoSync().windowWidth / 1.5 * 0.589) * 0.5,
              width: tt.getSystemInfoSync().windowWidth / 1.5,
              height: tt.getSystemInfoSync().windowWidth / 1.5 * 0.589
            },
            success(button) {
              params2Button = button
              function button_tap(res) {
                logger.log("2button_tap:" + res.buttonid)
                button.hide()
                button.offTap(button_tap)
                button.destroy()
                paramsButton.hide()
                paramsButton.destroy()
                params3Button.hide()
                params3Button.destroy()
                console.log(staminaBtn)
                staminaBtn.addEventListener('touchend', startButtonHandler)
              }
              button.onTap(button_tap)
            },
            fail(res) {
              console.log("创建失败", res.errMsg)
            },
          }
          let params3 = {
            type: "image",
            image: "images/microapp.png",
            style: {
              left: (tt.getSystemInfoSync().windowWidth - tt.getSystemInfoSync().windowWidth / 1.5) * 0.5 + tt.getSystemInfoSync().windowWidth / 3,
              top: (tt.getSystemInfoSync().windowHeight - tt.getSystemInfoSync().windowWidth / 1.5 * 0.589) * 0.5 + tt.getSystemInfoSync().windowWidth / 1.5 * 0.589 - tt.getSystemInfoSync().windowWidth / 6 * 0.589,
              width: tt.getSystemInfoSync().windowWidth / 3,
              height: tt.getSystemInfoSync().windowWidth / 6 * 0.589
            },
            success(button) {
              params3Button = button
              function button_tap(res) {
                logger.log("2button_tap:" + res.buttonid)
                button.hide()
                button.offTap(button_tap)
                button.destroy()
                paramsButton.hide()
                paramsButton.destroy()
                params2Button.hide()
                params2Button.destroy()
                const rewardedVideoAd = tt.createRewardedVideoAd({
                  adUnitId: '21o0p96tp0u95im7qf'
                })
                rewardedVideoAd.show()
                rewardedVideoAd.onClose((res) => {
                  if (res && res.isEnded) {
                    console.log(res)
                    play.stamina.staminaAdd(6)
                    play.stamina.setStorage()
                  }
                })
              }
              console.log(staminaBtn)
              staminaBtn.addEventListener('touchend', startButtonHandler)
              button.onTap(button_tap)
            },
            fail(res) {
              console.log("创建失败", res.errMsg)
            },
          }
          tt.createInteractiveButton(params)
          tt.createInteractiveButton(params2)
          tt.createInteractiveButton(params3)

        }, 300)
      }
    }
    console.log(staminaBtn)
    staminaBtn.addEventListener('touchend', startButtonHandler)

    const renderStartPage = function () {
      ctx.clearRect(0, 0, tt.getSystemInfoSync().windowWidth, tt.getSystemInfoSync().windowHeight)
      that.bg.render(ctx)
      startView.drawToCanvas(ctx)
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
            staminaBtn.removeEventListener('touchend', startButtonHandler)

            that.popup.show()
            return
          }

          if (that.isExist === true && that.popup.visible && !that.popup.isInside(x, y)) {
            that.popup.hide()
            startView.touchEndHandled = false
            console.log(staminaBtn)
            staminaBtn.addEventListener('touchend', startButtonHandler)
          }

          if (that.isExist === true && that.popup.visible && that.popup.isInside(x, y)) {
            that.popup.hide()
            console.log(staminaBtn)
            staminaBtn.addEventListener('touchend', startButtonHandler)
            tt.navigateToScene({
              scene: "sidebar",
              success: (res) => {
                play.stamina.staminaAdd(10)
                play.stamina.setStorage()
                startView.touchEndHandled = false
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
        startView.touchEndHandled = true
      }
      that.popup.renderOnCanvas(ctx)
    }

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
  startPage(clasli,clasliNum) {
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
    canvas.removeEventListener('touchmove', this.touchHandler)
    canvas.removeEventListener('touchend', this.touchHandler)

    // 绘制开始页面
    const startButton = new StartBtn(ctx, clasli,clasliNum)
    const backTag = new BackTag(ctx)
    const staminaBtn = new StaminaBtn(ctx)

    const startButtonHandler = function (e) {
      if (this.lastCollisionTime2 === undefined) {
        this.lastCollisionTime2 = Date.now()
      } else {
        if (Date.now() - this.lastCollisionTime2 < 500) {
          return
        }
        this.lastCollisionTime2 = Date.now()
      }
      e.preventDefault()

      const x = e.changedTouches[0].clientX
      const y = e.changedTouches[0].clientY

      const buttonArea = staminaBtn.btnArea

      if (x >= buttonArea.startX && x <= buttonArea.endX && y >= buttonArea.startY && y <= buttonArea.endY && play.isPlay !== true) {
        console.log(play.isPlay)
        staminaBtn.removeEventListener('touchend', startButtonHandler)
        setTimeout(() => {
          let paramsButton
          let params2Button
          let params3Button
          let params = {
            type: "image",
            image: "images/zhedangse.png",
            style: {
              left: 0,
              top: 0,
              width: tt.getSystemInfoSync().windowWidth,
              height: tt.getSystemInfoSync().windowHeight
            },
            success(button) {
              paramsButton = button
              function button_tap(res) {
                logger.log("1button_tap:" + res.buttonid)
                // button.hide();
                // button.offTap(button_tap);
                // button.destroy();
              }
              button.onTap(button_tap)
            },
            fail(res) {
              console.log("创建失败", res.errMsg)
            },
          }
          let params2 = {
            type: "image",
            image: "images/hdtl.png",
            style: {
              left: (tt.getSystemInfoSync().windowWidth - tt.getSystemInfoSync().windowWidth / 1.5) * 0.5,
              top: (tt.getSystemInfoSync().windowHeight - tt.getSystemInfoSync().windowWidth / 1.5 * 0.589) * 0.5,
              width: tt.getSystemInfoSync().windowWidth / 1.5,
              height: tt.getSystemInfoSync().windowWidth / 1.5 * 0.589
            },
            success(button) {
              params2Button = button
              function button_tap(res) {
                logger.log("2button_tap:" + res.buttonid)
                button.hide()
                button.offTap(button_tap)
                button.destroy()
                paramsButton.hide()
                paramsButton.destroy()
                params3Button.hide()
                params3Button.destroy()
                console.log(staminaBtn)
                staminaBtn.addEventListener('touchend', startButtonHandler)
              }
              button.onTap(button_tap)
            },
            fail(res) {
              console.log("创建失败", res.errMsg)
            },
          }
          let params3 = {
            type: "image",
            image: "images/microapp.png",
            style: {
              left: (tt.getSystemInfoSync().windowWidth - tt.getSystemInfoSync().windowWidth / 1.5) * 0.5 + tt.getSystemInfoSync().windowWidth / 3,
              top: (tt.getSystemInfoSync().windowHeight - tt.getSystemInfoSync().windowWidth / 1.5 * 0.589) * 0.5 + tt.getSystemInfoSync().windowWidth / 1.5 * 0.589 - tt.getSystemInfoSync().windowWidth / 6 * 0.589,
              width: tt.getSystemInfoSync().windowWidth / 3,
              height: tt.getSystemInfoSync().windowWidth / 6 * 0.589
            },
            success(button) {
              params3Button = button
              function button_tap(res) {
                logger.log("2button_tap:" + res.buttonid)
                button.hide()
                button.offTap(button_tap)
                button.destroy()
                paramsButton.hide()
                paramsButton.destroy()
                params2Button.hide()
                params2Button.destroy()
                const rewardedVideoAd = tt.createRewardedVideoAd({
                  adUnitId: '21o0p96tp0u95im7qf'
                })
                rewardedVideoAd.show()
                rewardedVideoAd.onClose((res) => {
                  if (res && res.isEnded) {
                    console.log(res)
                    play.stamina.staminaAdd(6)
                    play.stamina.setStorage()
                  }
                })
              }
              console.log(staminaBtn)
              staminaBtn.addEventListener('touchend', startButtonHandler)
              button.onTap(button_tap)
            },
            fail(res) {
              console.log("创建失败", res.errMsg)
            },
          }
          tt.createInteractiveButton(params)
          tt.createInteractiveButton(params2)
          tt.createInteractiveButton(params3)

        }, 300)
      }
    }
    console.log(staminaBtn)

    staminaBtn.addEventListener('touchend', startButtonHandler)

    const backToSceneHandler = function (e) {
      if (this.lastCollisionTime3 === undefined) {
        this.lastCollisionTime3 = Date.now()
      } else {
        if (Date.now() - this.lastCollisionTime3 < 500) {
          return
        }
        this.lastCollisionTime3 = Date.now()
      }
      e.preventDefault()

      const x = e.changedTouches[0].clientX
      const y = e.changedTouches[0].clientY

      const buttonArea = backTag.btnArea
      if (x >= buttonArea.startX && x <= buttonArea.endX && y >= buttonArea.startY && y <= buttonArea.endY) {
        staminaBtn.removeEventListener('touchend', startButtonHandler)
        backTag.removeEventListener('touchend', backToSceneHandler)
        startButton.clearAll()
        startButton.touchEndHandled = true
        setTimeout(() => {
          play.isPlay = false
          play.isView = true
          play.main.prototype.startView()
        }, 500)
        return
      }
    }

    backTag.addEventListener('touchend', backToSceneHandler)

    // 渲染开始页面
    const renderStartPage = function () {
      ctx.clearRect(0, 0, tt.getSystemInfoSync().windowWidth, tt.getSystemInfoSync().windowHeight);

      that.bg.render(ctx)
      startButton.drawToCanvas(ctx)
      backTag.drawToCanvas(ctx)
      staminaBtn.drawToCanvas(ctx)
      that.popup.renderOnCanvas(ctx)

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
