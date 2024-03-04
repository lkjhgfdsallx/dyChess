export default class avatarTags {
    constructor(ctx) {
        // 用户信息
        this.userInfo = {}
        this.getUserInfo()

        this.ctx = ctx
        this.width = tt.getSystemInfoSync().windowWidth * 0.44
        this.height = tt.getSystemInfoSync().windowHeight * 0.076
        this.x = 0
        this.y = this.height
  
        // 用户信息背景
        this.img = new Image()
        this.img.src = 'images/avatarTags.png'
        
        // 用户信息头像底
        this.img2 = new Image()
        this.img2.src = 'images/avatarCircle.png'

        // 用户信息花纹
        this.img3 = new Image()
        this.img3.src = 'images/avatarPattern.png'

        // 用户信息头像
        this.img4 = new Image()
        this.img4.src = 'images/mrtx.png'

        // 用户信息昵称
  
        // 定义按钮的点击区域
        this.btnArea = {
            startX: this.x,
            startY: this.y,
            endX: this.x + this.width,
            endY: this.y + this.height,
        }
    }

    getUserInfo() {
        tt.getStorage({
            key: "userInfo",
            success: (res) => {
              this.userInfo = res.data
              this.img4.src = this.userInfo.avatarUrl || 'images/mrtx.png'
            }
        })
    }
  
    draw() {
        const ctx = this.ctx

        const setFontSize = tt.getSystemInfoSync().windowWidth * 0.036
        const setFontText = this.userInfo.nickName ? this.userInfo.nickName.slice(0, 9) : '用户昵称'

        ctx.fillStyle = '#FFFFFF' // 文字颜色
        ctx.font = `${setFontSize}px Arial`
        ctx.letterSpacing = '1px'
        ctx.fillText(`${setFontText}`, this.x + this.width * 0.42, this.y + (this.height - setFontSize) / 2) // 文字内容、位置
    }
  
    // 添加事件监听
    addEventListener(event, handler) {
        canvas.addEventListener(event, handler)
    }
  
    // 移除事件监听
    removeEventListener(event, handler) {
        canvas.removeEventListener(event, handler)
    }
  
    // 将按钮绘制到 Canvas 上
    drawToCanvas(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.img3, this.x, this.y + this.height * 0.6, this.width * 0.34, this.height * 0.41)
        ctx.drawImage(this.img2, this.x + this.width * 0.06, this.y, this.width * 0.32, this.width * 0.32)
        ctx.drawImage(this.img4, this.x + this.width * 0.115, this.y * 1.15, this.width * 0.2, this.width * 0.2)
        this.draw()
    }
  }
  