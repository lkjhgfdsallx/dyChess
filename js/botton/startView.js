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
        this.img2.src = 'images/biankuang.png'

        this.img3 = new Image()
        this.img3.src = 'images/shuangdao.png'

        // 定义按钮的点击区域
        this.btnAreas = []

        // 添加事件监听
        this.addEventListener('touchstart', this.handleTouchStart.bind(this))
        this.addEventListener('touchmove', this.handleTouchMove.bind(this))
        this.addEventListener('touchend', this.handleTouchEnd.bind(this))

        this.touchEndHandled = false

        this.currentTouchY = 0
        this.isDragging = false
        this.dragThreshold = 15

        this.viewElement = [
            { text: '网红残局', num: '4513' },
            { text: '初入棋坛', num: '3245' },
            { text: '大众棋手', num: '6543' },
            { text: '小区棋王', num: '3132' },
            { text: '棋摊中坚', num: '7745' },
            { text: '路边枭雄', num: '2926' },
            { text: '嘎嘎乱杀', num: '1327' },
            { text: '各局复盘', num: '143' }
        ]

        this.updateOffscreenCanvas()
    }

    viewImg(img) {
        return 'images/view/' + img + '.png'
    }

    handleTouchStart(event) {
        this.touchStartX = event.touches[0].clientX
        this.touchStartY = event.touches[0].clientY
        this.currentTouchY = this.touchStartY
        this.isDragging = false
    }

    handleTouchMove(event) {
        event.preventDefault() // 阻止默认滚动行为

        const touchY = event.touches[0].clientY
        this.currentTouchY = touchY

        // 判断是否超过了拖动阈值
        if (!this.isDragging && Math.abs(touchY - this.touchStartY) > this.dragThreshold) {
            this.isDragging = true // 如果超过阈值，则标记为正在拖动
        }
    }

    handleTouchEnd(event) {
        if (!this.touchEndHandled) {
            const touchX = event.changedTouches[0].clientX
            const touchY = event.changedTouches[0].clientY

            // 转换触摸位置为相对于 offscreenCanvas 的坐标
            const offsetX = touchX - (this.x + (this.width - this.offscreenCanvas.width) * 0.5)
            const offsetY = touchY - (this.y + (this.height - this.offscreenCanvas.height) * 0.55)

            // 判断触摸位置是否在按钮区域内
            for (let i = 0; i < this.btnAreas.length; i++) {
                const area = this.btnAreas[i]
                if (offsetX >= area.startX && offsetX <= area.endX && offsetY >= area.startY && offsetY <= area.endY && this.isDragging !== true && play.isView !== false) {
                    const checkpointInfo = this.getCheckpointInfo(i)
                    if (checkpointInfo != null) {
                        console.log(play.isView)
                        setTimeout(() => {
                            play.isPlay = false
                            play.isView = false
                            play.main.prototype.startPage(com.clasli[i])
                            tt.setStorageSync("clasliNum", i) // 存储当前关卡的索引值到本地存储中
                        }, 300)
                        // this.touchEndHandled = true
                        // play.isPlay = true
                        // play.checkpoint1.playGame(checkpointInfo)
                        break
                    }
                }
            }
        }
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = src
            img.onload = () => resolve(img)
            img.onerror = reject
        })
    }

    async checkpoint() {
        const customsCleared = tt.getStorageSync("customsCleared1") || []
        this.btnAreas = []

        const promises = []
        for (let i = 0; i < 8; i++) {
            const imgPromise = this.loadImage(this.viewImg(i))
            promises.push(imgPromise)
        }

        const loadedImages = await Promise.all(promises)

        for (let i = 0; i < 8; i++) {
            const img = this.img2
            const row = Math.floor(i / 2)
            const col = i % 2
            const imgWidth = this.offscreenCanvas.width * 0.4
            const imgHeight = this.offscreenCanvas.height / 5
            const startX = col * (imgWidth + this.offscreenCanvas.width * 0.05) + (this.width - 2 * imgWidth - 2 * this.offscreenCanvas.width * 0.05) / 2
            const startY = row * (imgHeight + this.offscreenCanvas.height / 20) + 15

            this.offscreenCtx.drawImage(img, startX, startY, imgWidth, imgHeight)
            this.btnAreas.push({
                startX: startX,
                startY: startY,
                endX: startX + imgWidth,
                endY: startY + imgHeight,
            })

            const img4 = loadedImages[i]
            this.offscreenCtx.drawImage(img4, startX + imgWidth * 0.08, startY + imgHeight * 0.2, imgWidth * 0.21, imgHeight * 0.6)

            this.offscreenCtx.fillStyle = '#000000'
            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 17)}px Arial`
            const text = `${this.viewElement[i].text}`
            this.offscreenCtx.fillText(text, startX + imgWidth * 0.32, startY + imgHeight * 0.4)

            this.offscreenCtx.drawImage(this.img3, startX + imgWidth * 0.32, startY + imgHeight * 0.5, imgWidth * 0.2, imgHeight * 0.3)

            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 24)}px Arial`
            const text2 = `${this.viewElement[i].num}`
            this.offscreenCtx.fillText(text2, startX + imgWidth * 0.6, startY + imgHeight * 0.7)
        }
    }

    getCheckpointInfo(index) {
        const checkpoint = com.clasli[index]
        if (checkpoint) {
            return index
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
        this.checkpoint().then(() => {
            // 绘制到主画布
            this.drawToCanvas(this.ctx)
        })
    }

    // 将按钮绘制到 Canvas 上
    drawToCanvas(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.offscreenCanvas, this.x + (this.width - this.offscreenCanvas.width) * 0.5, this.y + (this.height - this.offscreenCanvas.height) * 0.55)
    }
}

window.StartView = StartView
