export default class CanvasScroll {
    constructor(ctx, scrollWidth, scrollHeight, imageSrc) {
        this.ctx = ctx;
        this.scrollWidth = scrollWidth;
        this.scrollHeight = scrollHeight;
        this.scrollY = 0;
        this.imageSrc = imageSrc;
        this.scrollArea = tt.createImage();
        this.scrollArea.onload = () => {
            // 创建离屏画布和上下文
            this.offscreenCanvas = tt.createCanvas();
            this.offscreenCanvas.width = canvas.width / 1.5;
            this.offscreenCanvas.height = canvas.height / 2;
            this.offscreenCtx = this.offscreenCanvas.getContext('2d');
            this.init();
            this.render();
        };
        this.scrollArea.src = imageSrc;
    }

    init() {
        let isTouching = false;
        let startY = 0;

        canvas.addEventListener('touchstart', (e) => {
            isTouching = true;
            startY = e.touches[0].clientY;
        });

        canvas.addEventListener('touchmove', (e) => {
            if (!isTouching) return;

            const deltaY = e.touches[0].clientY - startY;
            const scrollDelta = easeOutQuad(Math.abs(deltaY), 0, 100, 100);

            if (deltaY < 0) {
                this.scrollY += scrollDelta;
            } else {
                this.scrollY -= scrollDelta;
            }

            startY = e.touches[0].clientY;
            this.render();
        });

        canvas.addEventListener('touchend', () => {
            isTouching = false;
        });
    }

    render() {
        // 清除离屏画布的内容
        this.offscreenCtx.fillStyle = '#996d3c'; // 设置清除颜色为白色
        this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);

        // 绘制新的滚动区域
        this.offscreenCtx.drawImage(
            this.scrollArea,
            0,
            this.scrollY,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
        );

        // 在主画布上绘制离屏画布的内容
        this.ctx.drawImage(this.offscreenCanvas, (canvas.width - canvas.width / 1.5) / 2, canvas.height / 2);
        console.log(this.scrollY)
    }
}

function easeOutQuad(t, b, c, d) {
    t /= d;
    return -c * t * (t - 2) + b;
}
