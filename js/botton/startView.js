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
        this.offscreenCanvas.height = this.height * 0.82
        this.offscreenCtx = this.offscreenCanvas.getContext('2d')

        this.img = new Image()
        this.img.src = 'images/kk_title.png'
        this.img_t_bg = new Image()
        this.img_t_bg.src = 'images/kk_title_bg.png'

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
            { text: '网红残局', num: '10' },
            { text: '初入棋坛', num: '12' },
            { text: '大众棋手', num: '15' },
            { text: '小区棋王', num: '14' },
            { text: '棋摊中坚', num: '5' },
            { text: '路边枭雄', num: '7' },
            { text: '嘎嘎乱杀', num: '9' },
            { text: '各局复盘', num: '4' }
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
        event.stopPropagation()

        if (this.lastCollisionTime === undefined) {
            this.lastCollisionTime = Date.now()
          } else {
            if (Date.now() - this.lastCollisionTime < 500) {
              return
            }
            this.lastCollisionTime = Date.now()
        }
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
                            play.main.prototype.startPage(com.clasli[i],i)
                            tt.setStorageSync("clasliNum", i) // 存储当前关卡的索引值到本地存储中
                            console.log('start page?')
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
            // const img = this.img2
            const row = Math.floor(i / 2)
            const col = i % 2
            const imgWidth = this.offscreenCanvas.width * 0.38
            const imgHeight = this.offscreenCanvas.height / 5.0
            const startX = col * (imgWidth + this.offscreenCanvas.width * 0.05) + (this.width - 2 * imgWidth - 2 * this.offscreenCanvas.width * 0.05) / 2
            const startY = row * (imgHeight + this.offscreenCanvas.height / 20)

            // this.offscreenCtx.drawImage(img, startX, startY, imgWidth, imgHeight)
            this.btnAreas.push({
                startX: startX,
                startY: startY,
                endX: startX + imgWidth,
                endY: startY + imgHeight,
            })

            const img4 = loadedImages[i]
            this.offscreenCtx.drawImage(img4, startX + imgWidth * 0.08, startY + imgHeight * 0.2, imgWidth, imgHeight)

            this.offscreenCtx.fillStyle = '#FFFFFF'
            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 17)}px Arial`
            // const text = `${this.viewElement[i].text}`
            // this.offscreenCtx.fillText(text, startX + imgWidth * 0.32, startY + imgHeight * 0.4)

            this.offscreenCtx.drawImage(this.img3, startX + imgWidth * 0.62, startY + imgHeight * 0.9, imgWidth * 0.2, imgWidth * 0.2)

            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 24)}px Arial`
            const text2 = `x${this.viewElement[i].num}`
            this.offscreenCtx.fillText(text2, startX + imgWidth * 0.85, startY + imgHeight * 1.1)
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

    clearAll(){
        this.removeEventListener('touchstart', this.handleTouchStart)
        this.removeEventListener('touchmove', this.handleTouchMove)
        this.removeEventListener('touchend', this.handleTouchEnd)
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
        const imgWidth = this.width * 0.6
        const imgHeight = this.height / 15
        const startX = (this.width - imgWidth) / 2
        const startY = (imgHeight + this.height /6)
        ctx.drawImage(this.img_t_bg, startX, startY + imgHeight * 0.2 - 10, imgWidth + imgWidth * 0.24, imgHeight +20)
        ctx.drawImage(this.img,  startX + imgWidth * 0.12, startY + imgHeight * 0.2, imgWidth, imgHeight)
        ctx.drawImage(this.offscreenCanvas, this.x + (this.width - this.offscreenCanvas.width) * 0.5, this.y + (this.height - this.offscreenCanvas.height) * 0.45)
    }
}

window.StartView = StartView
