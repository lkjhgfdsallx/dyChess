import Matter from './libs/matter.js'
import Collide from './base/collisions'
import Ball from './player/ball'
import Net from './player/net'
import Border from './player/border'
import ProgressBar from './player/progressBar'
import Score from './player/score'
import GameOver from './player/gameOver'
import GameInfo from './runtime/gameinfo'

const ctx = canvas.getContext('2d')
ctx.fillStyle = '#000000'

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.goal = false
    this.restart()
  }
  restart() {
    this.touchEvent()
    const engine = Matter.Engine.create()
    const world = engine.world  // 物理环境
    world.gravity.y = 0.98 // 设置重力

    // 创建一个渲染器
    const render = Matter.Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: canvas.width,
        height: canvas.height,
        wireframes: false,
        showSleeping: false,
        background:'#000000'
      }
    })
    // 启动引擎与渲染器
    Matter.Engine.run(engine)
    Matter.Render.run(render)
    // 创建背景
    const background = Matter.Bodies.rectangle(canvas.width / 2, canvas.height / 2, 235, 30, {
      isStatic: true,
      collisionFilter: { category: 0x0001, mask: 0x0000 },
      restitution: 0,
      render: {
        visible: true,
        sprite: {
          texture: 'images/bg.png',
          xScale:  canvas.width / 414,
          yScale:  canvas.height / 736,
        }
      }
    })
    Matter.World.add(world, background)

    this.ball = new Ball(world)
    this.Net = new Net(world)
    this.border = new Border(world)
    this.progressBar = new ProgressBar(world)
    this.collide = new Collide(engine)
    this.score = new Score(world)
    this.gameinfo = new GameInfo()
    this.gameOver = new GameOver(this.gameinfo)
    this.render()

    // 检测进球与得分
    let timer = null
    let sleep = false
    Matter.Events.on(engine, 'beforeUpdate', (event) => {
      // 判断进球与否
      if (this.collide.isCollideWith(this.Net.stack.bodies[0], this.ball.ball) && this.collide.isCollideWith(this.Net.stack.bodies[1], this.ball.ball)) {
        if (this.lastCollisionTime === undefined) {
          this.lastCollisionTime = Date.now()
        } else {
          if (Date.now() - this.lastCollisionTime < 500) {
            return
          }
          this.lastCollisionTime = Date.now()
        }
        this.score.score = this.score.score + 2
        this.score.updateScoreDisplay()
        tt.vibrateShort()
        this.goal = true
        // 进球后的烟花特效
        if (this.score.score >= 10) {
          this.createFirework(world, canvas.width / 2, 0, 10)
        }
      }
      event.source.world.bodies.forEach((body) => {
        if (body.speed < 1.2 && this.ball.isInMotion) {
          if (!timer) {
            timer = setTimeout(() => {
              sleep = true
              timer = null
            }, 500)
          }
        } else {
          clearTimeout(timer)
          timer = null
        }
        if (body.render.sprite.texture && body.render.sprite.texture.includes('images/ball1.png') && sleep && this.ball.isInMotion) {
          sleep = false
          if (this.goal) {
            // 进球后
            this.nextPass()
            this.goal = false
          } else {
            // 游戏失败后
            Matter.Engine.clear(engine)
            Matter.World.clear(world)
            Matter.Render.stop(render)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            this.gameOver.drawToCanvas(ctx)
            this.gameOver.touchEvent(ctx, this.score.score)
          }
        }
        // 篮球长时间掉出边界后游戏失败
        if (body.render.sprite.texture && body.render.sprite.texture.includes('images/ball1.png') && this.ball.isOutOfBoundary(body.position.x, body.position.y)) {
          Matter.Engine.clear(engine)
          Matter.World.clear(world)
          Matter.Render.stop(render)
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          this.gameOver.drawToCanvas(ctx)
          this.gameOver.touchEvent(ctx, this.score.score)
        }
      })
    })
  }
  render() {
    this.collide.getCollide()
    this.progressBar.generateProgressBar()
    this.ball.generateBasketball()
    this.ball.event()
    this.Net.generateNet()
    this.border.generateBorder()
  }
  // 进球后烟花
  createFirework(world, x, y, velocity) {
    // 创建烟花粒子
    var particles = []
    for (var i = 0; i < 20; i++) {
      var particle = Matter.Bodies.circle(x, y, 5, {
        collisionFilter: { category: 0x0001, mask: 0x0000 },
        render: {
          fillStyle: ['#ff0000', '#ffff00', '#ff00ff', '#00ff00'][Math.floor(Math.random() * 4)]
        }
      })
      Matter.Body.setVelocity(particle, {
        x: (Math.random() - 0.5) * velocity,
        y: (Math.random() - 0.5) * velocity
      })
      particles.push(particle)
    }
    Matter.World.add(world, particles)
    setTimeout(() => {
      Matter.World.remove(world, particles)
    }, 1000)
  }
  // 进入下一关
  nextPass() {
    this.ball.remove()
    this.Net.remove()
    this.ball.generateBasketball()
    this.Net.generateNet()
    this.Net.translate(this.getRandomInt(-60, 100), this.getRandomInt(-100, 100))
  }
  getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }

  // 重新开始按钮点击事件
  touchEvent() {
    const touchStartHandler = (e) => {
      if (this.gameinfo.clickEvent === true) {
        e.preventDefault()
        const x = e.touches[0].clientX
        const y = e.touches[0].clientY

        const area = this.gameinfo.btnArea

        if (x >= area.startX
          && x <= area.endX
          && y >= area.startY
          && y <= area.endY) {
          this.gameinfo.closeClick()
          setTimeout(() => {
            this.restart()
          }, 300)
          canvas.removeEventListener('touchstart', touchStartHandler)
        }
      }
    }
    canvas.addEventListener('touchstart', touchStartHandler)
  }
}
