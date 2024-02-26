export default class StartButton {
    constructor(ctx) {
        this.ctx = ctx
        this.width = canvas.width * 0.89
        this.height = canvas.height * 0.72
        this.x = (canvas.width - this.width) / 2
        this.y = (canvas.height - this.height) / 1.5

        this.img = new Image()
        this.img.src = 'images/canvasScroll.png'

        this.checkpoint()

        // 定义按钮的点击区域
        this.btnArea = {
            startX: this.x,
            startY: this.y,
            endX: this.x + this.width,
            endY: this.y + this.height,
        }
    }

    checkpoint() {
        com.clasli.forEach((item) => {
            console.log(item.name)
        })
    }

    // draw() {
    //     const ctx = this.ctx

    //     ctx.fillStyle = '#000000' // 文字颜色
    //     ctx.font = '24px Arial'
    //     ctx.fillText('开始游戏', this.x + 100, this.y + 40)
    // }

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
        // this.draw()
    }
}
