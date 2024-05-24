class StartView {
    constructor(ctx, clasli) {
        this.ctx = ctx
        this.clasli = clasli
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

        this.isDragging = false // 标记是否正在拖动
        this.dragThreshold = 15 // 拖动的阈值，超过该值则认为是滑动而不是点击

        this.touchEndHandled = false
    }

    handleTouchStart(event) {
        // 记录触摸开始的Y坐标
        this.touchStartY = event.touches[0].clientY
        this.currentTouchY = this.touchStartY
        this.isDragging = false
    }

    handleTouchMove(event) {
        event.preventDefault() // 阻止默认滚动行为
        const subArrayB = com.clasli.slice(0, play.checkpoint1.clasli).reverse()
        const listNumB = subArrayB.length > 12 ? 12 : subArrayB.length

        const touchY = event.touches[0].clientY
        // 更新内容的Y轴偏移量
        const deltaY = touchY - this.currentTouchY
        this.currentTouchY = touchY
        this.contentOffsetY += deltaY

        // 判断是否超过了拖动阈值
        if (!this.isDragging && Math.abs(touchY - this.touchStartY) > this.dragThreshold) {
            this.isDragging = true // 如果超过阈值，则标记为正在拖动
        }

        // 添加限制，防止内容偏移过多
        if (play.checkpoint1.clasli > 0) {
            this.contentOffsetY = Math.max(this.contentOffsetY, -(this.offscreenCanvas.height * 4))
            this.contentOffsetY = Math.min(this.contentOffsetY, listNumB * this.offscreenCanvas.height / 5)
        } else {
            this.contentOffsetY = Math.max(this.contentOffsetY, -(this.offscreenCanvas.height * 4))
            this.contentOffsetY = Math.min(this.contentOffsetY, 0)
        }

        // 重新绘制内容
        this.updateOffscreenCanvas()
    }

    handleTouchEnd(event) {
        if (!this.touchEndHandled) {
            // 设置标志，表示事件已经处理过

            // 获取触摸结束时的坐标
            const touchX = event.changedTouches[0].clientX
            const touchY = event.changedTouches[0].clientY

            // 计算实际的离屏 Canvas 位置，考虑滑动的偏移量
            const offsetX = this.x + (this.width - this.offscreenCanvas.width) * 0.5
            const offsetY = this.y + (this.height - this.offscreenCanvas.height) * 0.55 + this.contentOffsetY

            // 判断触摸位置是否在按钮区域内
            if (touchX >= offsetX && touchX <= offsetX + this.offscreenCanvas.width && touchY > this.y + (this.height - this.offscreenCanvas.height) * 0.55 && this.isDragging === false) {
                // 计算相对于按钮区域的相对位置，考虑滑动的偏移量
                const relativeX = touchX - offsetX
                const relativeY = touchY - offsetY

                // 计算触摸的关卡序号
                const checkpointIndex = Math.floor(relativeY / (this.offscreenCanvas.height / 5))

                // 获取关卡信息
                const checkpointInfo = this.getCheckpointInfo(checkpointIndex)
                if (checkpointInfo != null) {
                    this.touchEndHandled = true
                    play.isPlay = true
                    play.checkpoint1.playGame(checkpointInfo)
                }
            }
        }
    }

    checkpoint() {
        const customsCleared = tt.getStorageSync("customsCleared") || []
        if (play.checkpoint1.clasli > 0) {
            const subArrayB = com.clasli.slice(0, play.checkpoint1.clasli).reverse()
            const listNumB = subArrayB.length > 12 ? 12 : subArrayB.length
            for (let i = 0; i < listNumB; i++) {
                if (customsCleared.indexOf(play.checkpoint1.clasli - i - 1) !== -1) {
                    this.offscreenCtx.drawImage(this.img2, this.offscreenCanvas.width * 0.05, this.contentOffsetY - (i + 1) * this.offscreenCanvas.height / 5, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
                    this.offscreenCtx.fillStyle = '#DED1B4'
                    const text = `${subArrayB[i].name.split("：")[0]}`
                    let fontSize = parseInt(this.offscreenCanvas.height / 30)
                    let wordCount = text.length
                    if (wordCount > 3) {
                        fontSize *= Math.pow(0.8, (wordCount - 3))
                    }
                    this.offscreenCtx.font = `${fontSize}px Arial`
                    this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 10) - (i + 1) * this.offscreenCanvas.height / 5)
                    this.offscreenCtx.fillStyle = '#7C622D'
                    this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
                    const text2 = `${subArrayB[i].name.split("：")[1]}`
                    this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.34, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) - (i + 1) * this.offscreenCanvas.height / 5)
                    this.offscreenCtx.drawImage(this.img4, this.offscreenCanvas.width * 0.73, this.offscreenCanvas.height / 30 + this.contentOffsetY - (i + 1) * this.offscreenCanvas.height / 5, this.offscreenCanvas.height / 8, this.offscreenCanvas.height / 8)
                } else {
                    this.offscreenCtx.drawImage(this.img3, this.offscreenCanvas.width * 0.05, this.contentOffsetY - (i + 1) * this.offscreenCanvas.height / 5, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
                    this.offscreenCtx.fillStyle = '#DED1B4'
                    const text = `${subArrayB[i].name.split("：")[0]}`
                    let fontSize = parseInt(this.offscreenCanvas.height / 30)
                    let wordCount = text.length
                    if (wordCount > 3) {
                        fontSize *= Math.pow(0.8, (wordCount - 3))
                    }
                    this.offscreenCtx.font = `${fontSize}px Arial`
                    this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 10) - (i + 1) * this.offscreenCanvas.height / 5)
                    this.offscreenCtx.fillStyle = '#7C622D'
                    this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
                    const text2 = `${subArrayB[i].name.split("：")[1]}`
                    this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.38, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) - (i + 1) * this.offscreenCanvas.height / 5)
                }
            }
        }

        if (customsCleared.indexOf(play.checkpoint1.clasli) !== -1) {
            this.offscreenCtx.drawImage(this.img2, this.offscreenCanvas.width * 0.05, this.contentOffsetY, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
            this.offscreenCtx.fillStyle = '#DED1B4'
            const text = `${com.clasli[play.checkpoint1.clasli].name.split("：")[0]}`
            let fontSize = parseInt(this.offscreenCanvas.height / 30)
            let wordCount = text.length
            if (wordCount > 3) {
                fontSize *= Math.pow(0.8, (wordCount - 3))
            }
            this.offscreenCtx.font = `${fontSize}px Arial`
            this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 10))
            this.offscreenCtx.fillStyle = '#7C622D'
            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
            const text2 = `${com.clasli[play.checkpoint1.clasli].name.split("：")[1]}`
            this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.34, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9))
            this.offscreenCtx.drawImage(this.img4, this.offscreenCanvas.width * 0.73, this.offscreenCanvas.height / 30 + this.contentOffsetY, this.offscreenCanvas.height / 8, this.offscreenCanvas.height / 8)
        } else {
            this.offscreenCtx.drawImage(this.img3, this.offscreenCanvas.width * 0.05, this.contentOffsetY, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
            this.offscreenCtx.fillStyle = '#DED1B4'
            const text = `${com.clasli[play.checkpoint1.clasli].name.split("：")[0]}`
            let fontSize = parseInt(this.offscreenCanvas.height / 30)
            let wordCount = text.length
            if (wordCount > 3) {
                fontSize *= Math.pow(0.8, (wordCount - 3))
            }
            this.offscreenCtx.font = `${fontSize}px Arial`
            this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 10))
            this.offscreenCtx.fillStyle = '#7C622D'
            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
            const text2 = `${com.clasli[play.checkpoint1.clasli].name.split("：")[1]}`
            this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.34, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9))
        }

        const subArray = com.clasli.slice(play.checkpoint1.clasli)
        const listNum = subArray.length > 27 ? 27 : subArray.length
        for (let i = 1; i < listNum; i++) {
            if (customsCleared.indexOf(i + play.checkpoint1.clasli) !== -1) {
                this.offscreenCtx.drawImage(this.img2, this.offscreenCanvas.width * 0.05, this.contentOffsetY + i * this.offscreenCanvas.height / 5, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
                this.offscreenCtx.fillStyle = '#DED1B4'
                const text = `${subArray[i].name.split("：")[0]}`
                let fontSize = parseInt(this.offscreenCanvas.height / 30)
                let wordCount = text.length
                if (wordCount > 3) {
                    fontSize *= Math.pow(0.8, (wordCount - 3))
                }
                this.offscreenCtx.font = `${fontSize}px Arial`
                this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 10) + i * this.offscreenCanvas.height / 5)
                this.offscreenCtx.fillStyle = '#7C622D'
                this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
                const text2 = `${subArray[i].name.split("：")[1]}`
                this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.34, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) + i * this.offscreenCanvas.height / 5)
                this.offscreenCtx.drawImage(this.img4, this.offscreenCanvas.width * 0.73, this.offscreenCanvas.height / 30 + this.contentOffsetY + i * this.offscreenCanvas.height / 5, this.offscreenCanvas.height / 8, this.offscreenCanvas.height / 8)
            } else {
                this.offscreenCtx.drawImage(this.img3, this.offscreenCanvas.width * 0.05, this.contentOffsetY + i * this.offscreenCanvas.height / 5, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
                this.offscreenCtx.fillStyle = '#DED1B4'
                const text = `${subArray[i].name.split("：")[0]}`
                let fontSize = parseInt(this.offscreenCanvas.height / 30)
                let wordCount = text.length
                if (wordCount > 3) {
                    fontSize *= Math.pow(0.8, (wordCount - 3))
                }
                this.offscreenCtx.font = `${fontSize}px Arial`
                this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 10) + i * this.offscreenCanvas.height / 5)
                this.offscreenCtx.fillStyle = '#7C622D'
                this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
                const text2 = `${subArray[i].name.split("：")[1]}`
                this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.38, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) + i * this.offscreenCanvas.height / 5)
            }
        }

    }

    getCheckpointInfo(index) {
        const checkpoint = com.clasli[parseInt(play.checkpoint1.clasli) + index]
        if (checkpoint) {
            return parseInt(play.checkpoint1.clasli) + index
        } else {
            return null
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

        // 重新绘制或更新内容
        this.checkpoint()
    }

    // 将按钮绘制到 Canvas 上
    drawToCanvas(ctx) {
        this.checkpoint()
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.offscreenCanvas, this.x + (this.width - this.offscreenCanvas.width) * 0.5, this.y + (this.height - this.offscreenCanvas.height) * 0.55)
    }
}

window.StartView = StartView