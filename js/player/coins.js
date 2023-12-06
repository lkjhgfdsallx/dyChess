import Matter from '../libs/matter.js'

export default class Coin {
    constructor(world, x, y, visible) {
        this.world = world
        this.x = x
        this.y = y
        this.visible = visible
    }
    generateCoin() {
        const coins = Matter.Bodies.rectangle(this.x, this.y, 15, 15, {
            isStatic: true,
            collisionFilter: { category: 0x0001, mask: 0x0000 },
            restitution: 0,
            render: {
                visible: this.visible,
                sprite: {
                    texture: 'images/coins.png',
                }
            }
        })
        return coins
    }
}
