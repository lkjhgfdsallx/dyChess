export default class staminaBtn {
    constructor(ctx) {

        this.ctx = ctx
        this.centreX = (tt.getSystemInfoSync().windowWidth - 325) / 2
        this.centreY = (tt.getSystemInfoSync().windowHeight - 403) / 2

        //体力图标
        this.staminaIcon = new Image();
        this.staminaIcon.src = "images/staminaIcon.png";

        //体力图标2
        this.staminaIcon2 = new Image();
        this.staminaIcon2.src = "images/staminaIcon1.png";

        //体力图标3
        this.staminaIcon3 = new Image();
        this.staminaIcon3.src = "images/staminaIcon2.png";

        // 定义按钮的点击区域
        this.btnArea = {
            startX: tt.getSystemInfoSync().windowWidth - tt.getSystemInfoSync().windowWidth / 12 - this.centreX + 5,
            startY: tt.getSystemInfoSync().windowHeight * 0.075,
            endX: tt.getSystemInfoSync().windowWidth - tt.getSystemInfoSync().windowWidth / 12 - this.centreX + 5 + tt.getSystemInfoSync().windowWidth / 12 * 1.1,
            endY: tt.getSystemInfoSync().windowHeight * 0.075 + tt.getSystemInfoSync().windowWidth / 12 * 1.1,
        }
    }

    draw() {
        const ctx = this.ctx
        const staminaWidth = tt.getSystemInfoSync().windowWidth / 4

        const setFontSize = parseInt(staminaWidth / 5)

        ctx.fillStyle = '#FFFFFF' // 文字颜色
        ctx.font = `${setFontSize}px Arial`
        const text = `${play.stamina.stamina}`
        ctx.fillText(
            text,
            com.bgImg.width + com.centreX - staminaWidth / 2 - ((play.stamina.stamina.toString().split('').length + 1) * (staminaWidth / 5)) / 2 + (staminaWidth - parseInt(staminaWidth / 1.5)) / 2,
            tt.getSystemInfoSync().windowHeight * 0.076 + (staminaWidth - setFontSize) * 0.3
        ) // 文字内容、位置
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
        const staminaWidth = tt.getSystemInfoSync().windowWidth / 4
        const staminaHeight = tt.getSystemInfoSync().windowWidth / 12
        ctx.drawImage(this.staminaIcon, tt.getSystemInfoSync().windowWidth - staminaWidth - this.centreX + 5, tt.getSystemInfoSync().windowHeight * 0.076, staminaWidth, staminaHeight)
        ctx.drawImage(this.staminaIcon2, tt.getSystemInfoSync().windowWidth - staminaWidth - this.centreX, tt.getSystemInfoSync().windowHeight * 0.074, staminaHeight, staminaHeight * 1.49)
        ctx.drawImage(this.staminaIcon3, tt.getSystemInfoSync().windowWidth - staminaHeight - this.centreX + 5, tt.getSystemInfoSync().windowHeight * 0.075, staminaHeight * 1.1, staminaHeight * 1.1)
        this.draw()
    }
}
