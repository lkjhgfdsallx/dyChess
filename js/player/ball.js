import Matter from '../libs/matter.js'

export default class Ball {
  constructor(world) {
    this.world = world
    this.angle = 0
    this.ball = null
    this.isInMotion = false
    this.motionTime = undefined
    this.outOfBoundaryTime = 0 // 用于记录篮球掉出边界的时间
  }
  // 生成篮球
  generateBasketball() {
    this.ball = Matter.Bodies.circle(window.innerWidth * 0.22, window.innerHeight * 0.58, 20, {
      restitution: 0.6,    // 弹性系数
      firction: 1,         // 摩擦力
      density: 2,          // 密度
      isStatic: true,
      collisionFilter: { category: 0x0002, mask: 0x0001 },
      render: {
        visible: true,     // 关闭线框
        sprite: {
          texture: 'images/ball1.png'
        }
      }
    })
    Matter.World.add(this.world, this.ball)
    this.isInMotion = false
    this.motionTime = undefined
  }
  event() {
    let ball2 = Matter.Bodies.circle(25, canvas.height / 2 - 210 / 2, 20, {
      restitution: 0.8,    // 弹性系数
      firction: 1,         // 摩擦力
      density: 2,          // 密度
      isStatic: true,
      collisionFilter: { category: 0x0002, mask: 0x0001 },
      render: {
        visible: true,     // 关闭线框
        sprite: {
          texture: 'images/ball2.png'
        }
      }
    })
    let interval
    let power = 0
    let time1 = 0
    Matter.World.add(this.world, ball2)

    // 监听触摸开始事件
    canvas.addEventListener('touchstart', (event) => {
      if (this.ball.isStatic) {
        time1 = Date.now()
        this.setAngle(event)
        var increment = 1
        interval = setInterval(function () {
          power += increment
          ball2.position.y = ball2.positionPrev.y + power * 2.13
          if (power >= 80 && increment > 0) {
            ball2.render.sprite.texture = 'images/fireball.png'
          } else if (power >= 80 && increment < 0) {
            ball2.render.sprite.texture = 'images/fireball2.png'
          } else {
            ball2.render.sprite.texture = 'images/ball2.png'
          }
          if (power == 100 || power == 0) {
            increment *= -1
          }
        }, 50)
      }
    })
    // 监听触摸结束事件
    canvas.addEventListener('touchend', (event) => {
      if (this.ball.isStatic) {
        const previousDots = this.world.bodies.filter(body => body.render.fillStyle === 'white')
        previousDots.forEach(dot => Matter.World.remove(this.world, dot))
        clearInterval(interval)
        setTimeout(() => {
          ball2.position.y = canvas.height / 2 - 210 / 2
          ball2.render.sprite.texture = 'images/ball2.png'
        }, 1500)
        // 计算力道
        const force = power / 5 // 根据按住鼠标的时长计算力道
        // 计算篮球投掷时的速度分量
        const speed = 10 + force // 速度大小
        const velocityX = 1.85 * speed * Math.cos(this.angle) // 根据角度计算水平方向的速度
        const velocityY = 1.85 * speed * Math.sin(this.angle) // 根据角度计算垂直方向的速度
        // 将篮球设置为动态
        Matter.Body.setStatic(this.ball, false)
        // 设置篮球速度
        Matter.Body.setVelocity(this.ball, { x: velocityX, y: velocityY })
        // 设置篮球角速度
        Matter.Body.setAngularVelocity(this.ball, -0.1)
        power = 0
        this.isInMotion = true
        this.motionTime = Date.now() - time1
      }
    })
    // 监听手指移动
    canvas.addEventListener('touchmove', (event) => {
      if (this.ball.isStatic) {
        this.setAngle(event)
        this.generateWhiteDots(power)
      }
    })
  }
  setAngle(event) {
    // 获取canvas的位置信息
    const rect = canvas.getBoundingClientRect()
    // 获取触摸点的坐标
    const touchX = event.touches[0].clientX - rect.left
    const touchY = event.touches[0].clientY - rect.top
    // 计算角度
    this.angle = Math.atan2(touchY - this.ball.position.y, touchX - this.ball.position.x)
    // 设置篮球角度
    Matter.Body.setAngle(this.ball, this.angle)
  }
  remove() {
    Matter.World.remove(this.world, this.ball)
  }
  // 生成斜抛线
  generateWhiteDots(power) {
    const previousDots = this.world.bodies.filter(body => body.render.fillStyle === 'white')
    previousDots.forEach(dot => Matter.World.remove(this.world, dot))
    const trajectoryPoints = []
    const dt = 4
    const g = .45
    let x = window.innerWidth * 0.22
    let y = window.innerHeight * 0.58
    let vx = (10 + (power / 5)) * Math.cos(this.angle)
    let vy = (10 + (power / 5)) * Math.sin(this.angle)
    let t = 0

    for (let i = 0; i < 6; i++) {
      x += vx * dt
      y += vy * dt
      vy += g * dt
      t += dt
      trajectoryPoints.push({ x, y })
    }

    for (let i = 0; i < trajectoryPoints.length; i++) {
      const point = trajectoryPoints[i]
      const dot = Matter.Bodies.circle(point.x, point.y, 2, {
        isStatic: true,
        render: {
          visible: true,
          fillStyle: 'white'
        }
      })
      Matter.World.add(this.world, dot)
    }
  }
  isOutOfBoundary(x, y) {
    const { innerWidth, innerHeight } = window
    const currentTime = Date.now()
    if (x < 0 || x > innerWidth || y < 0 || y > innerHeight) {
      if (this.outOfBoundaryTime === 0) {
        this.outOfBoundaryTime = currentTime // 记录篮球掉出边界的时间
      }
      if (currentTime - this.outOfBoundaryTime > 1500) {
        return true // 超过1000ms后返回true
      }
    } else {
      this.outOfBoundaryTime = 0 // 如果篮球在边界内，重置记录的时间
    }
    return false
  }

}
