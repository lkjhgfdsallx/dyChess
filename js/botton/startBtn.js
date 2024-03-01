export default class StartButton {
    constructor(ctx) {
        this.ctx = ctx
        this.width = tt.getSystemInfoSync().windowWidth * 0.89
        this.height = tt.getSystemInfoSync().windowHeight * 0.72
        this.x = (tt.getSystemInfoSync().windowWidth - this.width) / 2
        this.y = (tt.getSystemInfoSync().windowHeight - this.height) / 1.5

        // 创建离屏 Canvas 并设置其宽高
        this.offscreenCanvas = tt.createCanvas()
        this.offscreenCanvas.width = this.width * 0.96
        this.offscreenCanvas.height = this.height * 0.72
        this.offscreenCtx = this.offscreenCanvas.getContext('2d')

        this.img = new Image()
        this.img.src = 'images/canvasScroll.png'

        this.img2 = new Image()
        this.img2.src = 'images/levelSelected.png'

        this.img3 = new Image()
        this.img3.src = 'images/levelNotSelected.png'

        this.img4 = new Image()
        this.img4.src = 'images/levelSelectedduigou.png'

        // this.checkpoint()

        // 定义按钮的点击区域
        this.btnArea = {
            startX: this.x + (this.width - this.offscreenCanvas.width) * 0.5,
            startY: this.y + (this.height - this.offscreenCanvas.height) * 0.55,
            endX: this.x + (this.width - this.offscreenCanvas.width) * 0.5 + this.offscreenCanvas.width,
            endY: this.y + (this.height - this.offscreenCanvas.height) * 0.55 + this.offscreenCanvas.height,
        }

        this.currentTouchY = 0
        this.contentOffsetY = 0
        this.touchStartY = 0

        // 添加事件监听
        this.addEventListener('touchstart', this.handleTouchStart.bind(this))
        this.addEventListener('touchmove', this.handleTouchMove.bind(this))
        this.addEventListener('touchend', this.handleTouchEnd.bind(this))
    }

    handleTouchStart(event) {
        // 记录触摸开始的Y坐标
        this.touchStartY = event.touches[0].clientY
        this.currentTouchY = this.touchStartY
    }

    handleTouchMove(event) {
        event.preventDefault() // 阻止默认滚动行为
        const touchY = event.touches[0].clientY
        // 更新内容的Y轴偏移量
        const deltaY = touchY - this.currentTouchY
        this.currentTouchY = touchY
        this.contentOffsetY += deltaY

        // 添加限制，防止内容偏移过多
        if (play.checkpoint1.clasli > 0) {
            this.contentOffsetY = Math.max(this.contentOffsetY, -(this.offscreenCanvas.height))
            this.contentOffsetY = Math.min(this.contentOffsetY, this.offscreenCanvas.height / 5)
        } else {
            this.contentOffsetY = Math.max(this.contentOffsetY, -(this.offscreenCanvas.height))
            this.contentOffsetY = Math.min(this.contentOffsetY, 0)
        }

        // 重新绘制内容
        this.updateOffscreenCanvas()
    }

    handleTouchEnd(event) {
        // 触摸结束处理，这里可以添加一些回弹效果或者重置位置的逻辑
    }

    checkpoint() {
        if (play.checkpoint1.clasli > 0) {
            const subArrayB = com.clasli[play.checkpoint1.clasli - 1]
            this.offscreenCtx.drawImage(this.img3, this.offscreenCanvas.width * 0.05, this.contentOffsetY - this.offscreenCanvas.height / 5, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
            this.offscreenCtx.fillStyle = '#DED1B4'
            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.height / 30)}px Arial`
            const text = `${subArrayB.name.split("：")[0]}`
            this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 10) - this.offscreenCanvas.height / 5)
            this.offscreenCtx.fillStyle = '#7C622D'
            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
            const text2 = `${subArrayB.name.split("：")[1]}`
            this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.38, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) - this.offscreenCanvas.height / 5)
        }

        this.offscreenCtx.drawImage(this.img2, this.offscreenCanvas.width * 0.05, this.contentOffsetY, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
        this.offscreenCtx.fillStyle = '#DED1B4'
        this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.height / 30)}px Arial`
        const text = `${com.clasli[play.checkpoint1.clasli].name.split("：")[0]}`
        this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 10))
        this.offscreenCtx.fillStyle = '#7C622D'
        this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
        const text2 = `${com.clasli[play.checkpoint1.clasli].name.split("：")[1]}`
        this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.34, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9))

        this.offscreenCtx.drawImage(this.img4, this.offscreenCanvas.width * 0.73, this.offscreenCanvas.height / 30 + this.contentOffsetY, this.offscreenCanvas.height / 8, this.offscreenCanvas.height / 8)


        const subArray = com.clasli.slice(play.checkpoint1.clasli)
        for (let i = 1; i < 12; i++) {
            this.offscreenCtx.drawImage(this.img3, this.offscreenCanvas.width * 0.05, this.contentOffsetY + i * this.offscreenCanvas.height / 5, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
            this.offscreenCtx.fillStyle = '#DED1B4'
            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.height / 30)}px Arial`
            const text = `${subArray[i].name.split("：")[0]}`
            this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 10) + i * this.offscreenCanvas.height / 5)
            this.offscreenCtx.fillStyle = '#7C622D'
            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
            const text2 = `${subArray[i].name.split("：")[1]}`
            this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.38, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) + i * this.offscreenCanvas.height / 5)
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

    updateOffscreenCanvas() {
        // 清除离屏 Canvas
        this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height)

        // 假设你有一个方法来重新绘制离屏 Canvas 的内容
        // 确保在绘制内容时，Y坐标加上 this.contentOffsetY
        // 例如: this.offscreenCtx.drawImage(img, x, y + this.contentOffsetY, width, height)

        // 重新绘制或更新内容
        this.checkpoint() // 假设这个方法会根据 this.contentOffsetY 来更新绘制位置
    }

    // 将按钮绘制到 Canvas 上
    drawToCanvas(ctx) {
        this.checkpoint()
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.offscreenCanvas, this.x + (this.width - this.offscreenCanvas.width) * 0.5, this.y + (this.height - this.offscreenCanvas.height) * 0.55)
    }
}