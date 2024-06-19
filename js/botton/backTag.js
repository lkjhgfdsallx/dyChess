export default class backTag {
    constructor(ctx) {
        // 用户信息
        this.userInfo = {}
        this.ctx = ctx
        this.width = tt.getSystemInfoSync().windowWidth * 0.44
        this.height = tt.getSystemInfoSync().windowHeight * 0.076
        this.x = 0
        this.y = this.height
  
        // 用户信息背景
        this.img = new Image()
        this.img.src = 'images/back_home.png'

        // 定义按钮的点击区域
        this.btnArea = {
            startX: this.x + this.width * 0.06,
            startY: this.y + this.height * 0.2,
            endX: this.x + this.width * 0.06 + this.width * 0.23,
            endY: this.y + this.height * 0.2 + this.width * 0.23,
        }
    }
  
    draw() {
        const ctx = this.ctx

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
        ctx.drawImage(this.img, this.x, this.y, this.width*0.4, this.height* 0.7)
        // ctx.drawImage(this.img3, this.x, this.y + this.height * 0.6, this.width * 0.34, this.height * 0.41)
        // ctx.drawImage(this.img2, this.x + this.width * 0.06, this.y, this.width * 0.32, this.width * 0.32)
        // ctx.drawImage(this.img4, this.x + this.width * 0.115, this.y * 1.15, this.width * 0.2, this.width * 0.2)
        this.draw()
    }

    // 绘制侧边栏领奖
    drawRuKoYouJiang(ctx) {
        // ctx.drawImage(this.img5, this.x + this.width * 1.82, this.y + this.height * 1.55, this.width * 0.33, this.width * 0.33)
    }
  }
  