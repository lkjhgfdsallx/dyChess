import Matter from '../libs/matter.js'
import Coin from './coins'

export default class Net {
    constructor(world) {
        this.world = world
        this.stack = null
        this.nets = null
        this.coins = new Coin(world, window.innerWidth * 0.53 + 35.5, window.innerHeight * 0.27, false)
        this.coins1 = new Coin(world, window.innerWidth * 0.53 + 35.5, window.innerHeight * 0.27 + 20, false)
    }
    generateNet() {
        this.nets = Matter.Composites.softBody(window.innerWidth * 0.53, window.innerHeight * 0.27, 11, 6, 0, 0, false, 3.2, {
            firction: 1, // 摩擦力
            frictionAir: 0.08, // 空气阻力
            restitution: 0.0001,
            render: { visible: false },
            collisionFilter: { group: Matter.Body.nextGroup(true) }
        }, {
            render: { lineWidth: 2, strokeStyle: "#fff" },
            stiffness: 1.4
        })
        // 将软体设置为静态
        this.nets.bodies[0].isStatic = true
        this.nets.bodies[2].isStatic = true
        this.nets.bodies[4].isStatic = true
        this.nets.bodies[6].isStatic = true
        this.nets.bodies[8].isStatic = true
        this.nets.bodies[10].isStatic = true
        const hoop1 = Matter.Bodies.circle(window.innerWidth * 0.53 + 6, window.innerHeight * 0.27, 2, {
            isStatic: true
        })
        const hoop2 = Matter.Bodies.circle(window.innerWidth * 0.53 + 67, window.innerHeight * 0.27, 2, {
            isStatic: true
        })
        const rebound = Matter.Bodies.rectangle(window.innerWidth * 0.53 + 102, window.innerHeight * 0.27 - 10, 40, 180, {
            isStatic: true,
            render: {
                visible: true,     // 关闭线框
                sprite: {
                    texture: 'images/rebound.png',
                }
            }
        })
        const hoopImg = Matter.Bodies.rectangle(window.innerWidth * 0.53 + 50, window.innerHeight * 0.27 + 3, 100, 27, {
            isStatic: true,
            collisionFilter: { category: 0x0001, mask: 0x0000 },
            restitution: 0,
            render: {
                visible: true,     // 关闭线框
                sprite: {
                    texture: 'images/hoop.png',
                }
            }
        })
        this.stack = Matter.Composite.create()
        Matter.Composite.add(this.stack, this.nets)
        Matter.Composite.add(this.stack, this.coins.generateCoin())
        Matter.Composite.add(this.stack, this.coins1.generateCoin())
        Matter.Composite.add(this.stack, hoop1)
        Matter.Composite.add(this.stack, hoop2)
        Matter.Composite.add(this.stack, rebound)
        Matter.Composite.add(this.stack, hoopImg)
        Matter.World.add(this.world, this.stack)
    }
    translate(x, y) {
        Matter.Composite.translate(this.stack, { x: x, y: y })
        for (var i = 0; i < 12; i++) {
            Matter.Body.translate(this.nets.bodies[i], { x: x, y: y })
        }
    }
    remove() {
        Matter.Composite.remove(this.world, this.stack)
    }
}
