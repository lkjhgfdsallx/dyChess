export default class StartButton {
    constructor(ctx) {
        this.ctx = ctx
        this.width = canvas.width * 0.89
        this.height = canvas.height * 0.72
        this.x = (canvas.width - this.width) / 2
        this.y = (canvas.height - this.height) / 1.5

        // 创建离屏 Canvas 并设置其宽高
        this.offscreenCanvas = tt.createCanvas()
        this.offscreenCanvas.width = this.width * 0.96
        this.offscreenCanvas.height = this.height * 0.83
        this.offscreenCtx = this.offscreenCanvas.getContext('2d')

        this.img = new Image()
        this.img.src = 'images/canvasScroll.png'

        this.img2 = new Image()
        this.img2.src = 'images/levelSelected.png'

        this.img3 = new Image()
        this.img3.src = 'images/levelNotSelected.png'

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
        this.img2.onload = () => {
            const subArray = com.clasli.slice(play.checkpoint1.clasli)
            this.offscreenCtx.drawImage(this.img2, this.offscreenCanvas.width * 0.05, this.offscreenCanvas.height / 12, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 6)
            this.offscreenCtx.fillStyle = '#DED1B4'
            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.height / 32)}px Arial`
            const text = `${com.clasli[play.checkpoint1.clasli].name.split("：")[0]}`
            this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.offscreenCanvas.height / 12 + parseInt(this.offscreenCanvas.height / 11))
            this.offscreenCtx.fillStyle = '#7C622D'
            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.height / 18)}px Arial`
            const text2 = `${com.clasli[play.checkpoint1.clasli].name.split("：")[1]}`
            this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.38, this.offscreenCanvas.height / 12 + parseInt(this.offscreenCanvas.height / 6))
        }
        this.img3.onload = () => {
            const subArray = com.clasli.slice(play.checkpoint1.clasli)
            for (let i = 1; i < 5; i++) {
                console.log(`Index: ${i}, Item: ${subArray[i]}`)
                this.offscreenCtx.drawImage(this.img3, this.offscreenCanvas.width * 0.05, this.offscreenCanvas.height / 12 + i * this.offscreenCanvas.height / 6, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 6)
            }
        }
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
        ctx.drawImage(this.offscreenCanvas, this.x + (this.width - this.offscreenCanvas.width) * 0.5, this.y + (this.height - this.offscreenCanvas.height) * 0.5)
    }
}
