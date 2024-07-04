class StartButton {
    constructor(ctx, clasli,clasliNum) {
        this.ctx = ctx
        this.clasli = clasli
        this.clasliNum = clasliNum
        this.width = tt.getSystemInfoSync().windowWidth * 0.89
        this.height = tt.getSystemInfoSync().windowHeight * 0.72
        this.x = (tt.getSystemInfoSync().windowWidth - this.width) / 2
        this.y = (tt.getSystemInfoSync().windowHeight - this.height) / 1.5

        // 创建离屏 Canvas 并设置其宽高
        this.offscreenCanvas = tt.createCanvas()
        this.offscreenCanvas.width = this.width * 0.96
        this.offscreenCanvas.height = this.height * 0.72
        this.offscreenCtx = this.offscreenCanvas.getContext('2d')
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

        this.img = new Image()
        this.img.src = 'images/kk_title_bg.png'

        this.img_level = new Image()
        this.img_level.src = 'images/kk_title_bg.png'

        this.img2 = new Image()
        this.img2.src = 'images/levelSelected.png'

        this.img3 = new Image()
        this.img3.src = 'images/levelNotSelected.png'

        this.img4 = new Image()
        this.img4.src = 'images/levelSelectedduigou.png'
        
        this.img5 = new Image()
        this.img5.src = 'images/level_num_bg.png'

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
        console.log('init')
    }

    handleTouchStart(event) {
        // 记录触摸开始的Y坐标
        this.touchStartY = event.touches[0].clientY
        this.currentTouchY = this.touchStartY
        this.isDragging = false
    }

    handleTouchMove(event) {
        const subArrayB = this.clasli.slice(0, play.checkpoint1.clasli).reverse()
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
        event.preventDefault() // 阻止默认滚动行为

        if (this.lastCollisionTime === undefined) {
            this.lastCollisionTime = Date.now()
          } else {
            if (Date.now() - this.lastCollisionTime < 500) {
              return
            }
            this.lastCollisionTime = Date.now()
        }
        if (!this.touchEndHandled) {
            // 设置标志，表示事件已经处理过

            // 获取触摸结束时的坐标
            const touchX = event.changedTouches[0].clientX
            const touchY = event.changedTouches[0].clientY

            // 计算实际的离屏 Canvas 位置，考虑滑动的偏移量
            const offsetX = this.x + (this.width - this.offscreenCanvas.width) * 0.5
            const offsetY = this.y + (this.height - this.offscreenCanvas.height) * 0.55 + this.contentOffsetY

            // 判断触摸位置是否在按钮区域内
            if (touchX >= offsetX && touchX <= offsetX + this.offscreenCanvas.width && touchY > this.y + (this.height - this.offscreenCanvas.height) * 0.55 && this.isDragging === false && !play.isView) {
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
                    play.checkpoint1.playGame(checkpointInfo, this.clasli)
                }
            }
        }
    }

    checkpoint() {
        const customsCleared = tt.getStorageSync("customsCleared1") || []
        if (play.checkpoint1.clasli > 0) {
            const subArrayB = this.clasli.slice(0, play.checkpoint1.clasli).reverse()
            const listNumB = subArrayB.length > 9 ? 9 : subArrayB.length
            for (let i = 0; i < listNumB; i++) {
                if (customsCleared.indexOf(play.checkpoint1.clasli - i - 1) !== -1) {
                    this.offscreenCtx.drawImage(this.img2, this.offscreenCanvas.width * 0.05, this.contentOffsetY - (i + 1) * this.offscreenCanvas.height / 5, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
                    this.offscreenCtx.drawImage(this.img5, this.offscreenCanvas.width * 0.15, this.contentOffsetY - (i + 1) * this.offscreenCanvas.height / 5 + this.offscreenCanvas.height / 15,this.offscreenCanvas.width * 0.15, this.offscreenCanvas.height / 15)

                    this.offscreenCtx.fillStyle = '#FFFFFF'
                    const text = `${subArrayB[i].name.split("：")[0]}`
                    let fontSize = parseInt(this.offscreenCanvas.height / 30)
                    let wordCount = text.length
                    if (wordCount > 3) {
                        fontSize *= Math.pow(0.8, (wordCount - 3))
                    }
                    this.offscreenCtx.font = `${fontSize}px Arial`
                    this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) - (i + 1) * this.offscreenCanvas.height / 5)
                    this.offscreenCtx.fillStyle = '#7C622D'
                    this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
                    const text2 = `${subArrayB[i].name.split("：")[1]}`
                    this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.34, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) - (i + 1) * this.offscreenCanvas.height / 5)
                    this.offscreenCtx.drawImage(this.img4, this.offscreenCanvas.width * 0.73, this.offscreenCanvas.height / 20 + this.contentOffsetY - (i + 1) * this.offscreenCanvas.height / 5, this.offscreenCanvas.height / 10, this.offscreenCanvas.height / 10)
                } else {
                    this.offscreenCtx.drawImage(this.img3, this.offscreenCanvas.width * 0.05, this.contentOffsetY - (i + 1) * this.offscreenCanvas.height / 5, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
                    this.offscreenCtx.drawImage(this.img5, this.offscreenCanvas.width * 0.15, this.contentOffsetY - (i + 1) * this.offscreenCanvas.height / 5 + this.offscreenCanvas.height / 15,this.offscreenCanvas.width * 0.15, this.offscreenCanvas.height / 15)

                    this.offscreenCtx.fillStyle = '#FFFFFF'
                    const text = `${subArrayB[i].name.split("：")[0]}`
                    let fontSize = parseInt(this.offscreenCanvas.height / 30)
                    let wordCount = text.length
                    if (wordCount > 3) {
                        fontSize *= Math.pow(0.8, (wordCount - 3))
                    }
                    this.offscreenCtx.font = `${fontSize}px Arial`
                    this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) - (i + 1) * this.offscreenCanvas.height / 5)
                    this.offscreenCtx.fillStyle = '#7C622D'
                    this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
                    const text2 = `${subArrayB[i].name.split("：")[1]}`
                    this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.38, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) - (i + 1) * this.offscreenCanvas.height / 5)
                }
            }
        }

        if (customsCleared.indexOf(play.checkpoint1.clasli) !== -1) {
            this.offscreenCtx.drawImage(this.img2, this.offscreenCanvas.width * 0.05, this.contentOffsetY, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
            this.offscreenCtx.drawImage(this.img5, this.offscreenCanvas.width * 0.15, this.contentOffsetY + this.offscreenCanvas.height / 15,this.offscreenCanvas.width * 0.15, this.offscreenCanvas.height / 15)

            this.offscreenCtx.fillStyle = '#FFFFFF'
            const text = `${this.clasli[play.checkpoint1.clasli].name.split("：")[0]}`
            let fontSize = parseInt(this.offscreenCanvas.height / 30)
            let wordCount = text.length
            if (wordCount > 3) {
                fontSize *= Math.pow(0.8, (wordCount - 3))
            }
            this.offscreenCtx.font = `${fontSize}px Arial`
            this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9))
            this.offscreenCtx.fillStyle = '#7C622D'
            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
            const text2 = `${this.clasli[play.checkpoint1.clasli].name.split("：")[1]}`
            this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.34, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9))
            this.offscreenCtx.drawImage(this.img4, this.offscreenCanvas.width * 0.73, this.offscreenCanvas.height / 30 + this.contentOffsetY, this.offscreenCanvas.height / 8, this.offscreenCanvas.height / 8)
        } else {
            this.offscreenCtx.drawImage(this.img3, this.offscreenCanvas.width * 0.05, this.contentOffsetY, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
            this.offscreenCtx.drawImage(this.img5, this.offscreenCanvas.width * 0.15, this.contentOffsetY + this.offscreenCanvas.height / 15, this.offscreenCanvas.width * 0.15, this.offscreenCanvas.height / 15)

            this.offscreenCtx.fillStyle = '#FFFFFF'
            const text = `${this.clasli[play.checkpoint1.clasli].name.split("：")[0]}`
            let fontSize = parseInt(this.offscreenCanvas.height / 30)
            let wordCount = text.length
            if (wordCount > 3) {
                fontSize *= Math.pow(0.8, (wordCount - 3))
            }
            this.offscreenCtx.font = `${fontSize}px Arial`
            this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9))
            this.offscreenCtx.fillStyle = '#AD865C'
            this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
            const text2 = `${this.clasli[play.checkpoint1.clasli].name.split("：")[1]}`
            this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.34, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9))
        }

        const subArray = this.clasli.slice(play.checkpoint1.clasli)
        const listNum = subArray.length > 27 ? 27 : subArray.length
        for (let i = 1; i < listNum; i++) {
            if (customsCleared.indexOf(i + play.checkpoint1.clasli) !== -1) {
                this.offscreenCtx.drawImage(this.img2, this.offscreenCanvas.width * 0.05, this.contentOffsetY + i * this.offscreenCanvas.height / 5, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
                this.offscreenCtx.drawImage(this.img5, this.offscreenCanvas.width * 0.15, this.contentOffsetY + i * this.offscreenCanvas.height / 5 + this.offscreenCanvas.height / 15,this.offscreenCanvas.width * 0.15, this.offscreenCanvas.height / 15)

                this.offscreenCtx.fillStyle = '#FFFFFF'
                const text = `${subArray[i].name.split("：")[0]}`
                let fontSize = parseInt(this.offscreenCanvas.height / 30)
                let wordCount = text.length
                if (wordCount > 3) {
                    fontSize *= Math.pow(0.8, (wordCount - 3))
                }
                this.offscreenCtx.font = `${fontSize}px Arial`
                this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) + i * this.offscreenCanvas.height / 5)
                this.offscreenCtx.fillStyle = '#7C622D'
                this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
                const text2 = `${subArray[i].name.split("：")[1]}`
                this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.34, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) + i * this.offscreenCanvas.height / 5)
                this.offscreenCtx.drawImage(this.img4, this.offscreenCanvas.width * 0.73, this.offscreenCanvas.height / 30 + this.contentOffsetY + i * this.offscreenCanvas.height / 5, this.offscreenCanvas.height / 8, this.offscreenCanvas.height / 8)
            } else {
                this.offscreenCtx.drawImage(this.img3, this.offscreenCanvas.width * 0.05, this.contentOffsetY + i * this.offscreenCanvas.height / 5, this.offscreenCanvas.width * 0.9, this.offscreenCanvas.height / 5)
                this.offscreenCtx.drawImage(this.img5, this.offscreenCanvas.width * 0.15, this.contentOffsetY + i * this.offscreenCanvas.height / 5 + this.offscreenCanvas.height / 15 ,this.offscreenCanvas.width * 0.15, this.offscreenCanvas.height / 15)

                this.offscreenCtx.fillStyle = '#FFFFFF'
                const text = `${subArray[i].name.split("：")[0]}`
                let fontSize = parseInt(this.offscreenCanvas.height / 30)
                let wordCount = text.length
                if (wordCount > 3) {
                    fontSize *= Math.pow(0.8, (wordCount - 3))
                }
                this.offscreenCtx.font = `${fontSize}px Arial`
                this.offscreenCtx.fillText(text, this.offscreenCanvas.width * 0.16, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) + i * this.offscreenCanvas.height / 5)
                this.offscreenCtx.fillStyle = '#7C622D'
                this.offscreenCtx.font = `${parseInt(this.offscreenCanvas.width / 16)}px Arial`
                const text2 = `${subArray[i].name.split("：")[1]}`
                this.offscreenCtx.fillText(text2, this.offscreenCanvas.width * 0.38, this.contentOffsetY + parseInt(this.offscreenCanvas.height / 9) + i * this.offscreenCanvas.height / 5)
            }
        }

    }

    getCheckpointInfo(index) {
        const checkpoint = this.clasli[parseInt(play.checkpoint1.clasli) + index]
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

    clearAll(){
        this.removeEventListener('touchstart', this.handleTouchStart)
        this.removeEventListener('touchmove', this.handleTouchMove)
        this.removeEventListener('touchend', this.handleTouchEnd)
        this.touchEndHandled = true
        console.log('cleanAll')
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
        const imgWidth = this.width * 0.6
        const imgHeight = this.height / 15
        const startX = (this.width - imgWidth) / 2
        const startY = (imgHeight + this.height /5)
        ctx.drawImage(this.img, startX - imgWidth * 0.08, startY + imgHeight * 0.2 - 10, imgWidth +imgWidth * 0.34, imgHeight +20)
        const withdrawBtnWidth = tt.getSystemInfoSync().windowWidth / 8    
        const staminaWidth = tt.getSystemInfoSync().windowWidth / 4
        const staminaHeight = withdrawBtnWidth / 1.5
		const levelNameText = this.viewElement[this.clasliNum].text
		ctx.fillStyle = '#74491D'

		let fontSize = parseInt(this.width / 8)
		let wordCount = levelNameText.length
		if (wordCount > 3) {
			fontSize *= Math.pow(0.85, (wordCount - 3))
		}

		ctx.font = `${fontSize}px Arial`
        ctx.fillText(`${levelNameText}`, startX + 30 + (staminaWidth * 0.75 - parseInt(withdrawBtnWidth / 4) * 3) / 2, startY + (staminaHeight + parseInt(withdrawBtnWidth / 5)) )
        ctx.drawImage(this.offscreenCanvas, this.x + (this.width - this.offscreenCanvas.width) * 0.5, this.y + (this.height - this.offscreenCanvas.height) * 0.55)
    }
}

window.StartBtn = StartButton