export default class staminaBtn {
    constructor(ctx) {

        this.ctx = ctx
        this.centreX = (canvas.width - 325) / 2
        this.centreY = (canvas.height - 403) / 2

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
            startX: this.x,
            startY: this.y,
            endX: this.x + this.width,
            endY: this.y + this.height,
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
			com.centreY - parseInt(staminaWidth / 2.3)
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
        ctx.drawImage(this.staminaIcon, canvas.width - staminaWidth - this.centreX + 5, this.centreY - staminaHeight * 2, staminaWidth, staminaHeight)
        ctx.drawImage(this.staminaIcon2, canvas.width - staminaWidth - this.centreX, this.centreY - staminaHeight * 2.2, staminaHeight, staminaHeight * 1.49)
        ctx.drawImage(this.staminaIcon3, canvas.width - staminaHeight - this.centreX + 5, this.centreY - staminaHeight * 2.1, staminaHeight * 1.1, staminaHeight * 1.1)
        this.draw()
    }
}
