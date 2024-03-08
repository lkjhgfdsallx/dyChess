export default class Popup {
    constructor(options) {
        this.offscreenCanvas = tt.createCanvas()
        this.offscreenCanvas.width = tt.getSystemInfoSync().windowWidth
        this.offscreenCanvas.height = tt.getSystemInfoSync().windowHeight
        this.ctx = this.offscreenCanvas.getContext('2d')

        this.x = options.x
        this.y = options.y
        this.width = options.width
        this.height = options.height
        this.image = new Image()
        this.image.src = options.image || null
        this.text = options.text || ''
        this.visible = false
    }

    isInside(x, y) {
        return x >= this.x && x <= this.x + this.width &&
            y >= this.y + this.height * 0.11 && y <= this.y + this.height
    }

    draw() {
        if (!this.visible) return

        // 清除离屏Canvas
        this.ctx.clearRect(this.x, this.y, this.width, this.height)

        // 如果有图片，则绘制图片
        if (this.image.src) {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        } else {
            // 绘制弹框背景
            this.ctx.fillStyle = '#AAAAAA'
            this.ctx.fillRect(this.x, this.y, this.width, this.height)
        }

        // 绘制文字
        this.ctx.fillStyle = '#000'
        this.ctx.font = '24px Microsoft YaHei'
        this.ctx.fillText(this.text, this.x + (this.width - this.text.length * 24) / 2, this.y + (this.height) / 2, this.width, this.height)
    }

    show() {
        this.visible = true
        this.draw()
    }

    hide() {
        this.visible = false
    }

    renderOnCanvas(mainCtx) {
        if (!this.visible) return
        mainCtx.drawImage(this.offscreenCanvas, 0, 0, tt.getSystemInfoSync().windowWidth, tt.getSystemInfoSync().windowHeight)
    }
}
