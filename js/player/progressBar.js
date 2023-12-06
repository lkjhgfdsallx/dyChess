import Matter from '../libs/matter.js'

export default class ProgressBar {
    constructor(world) {
        this.world = world
    }
    generateProgressBar() {
        const progressBar = Matter.Bodies.rectangle(25, canvas.height / 2, 235, 30, {
            isStatic: true,
            collisionFilter: { category: 0x0001, mask: 0x0000 },
            restitution: 0,
            render: {
                visible: true,
                sprite: {
                    texture: 'images/jdt.png',
                }
            }
        })
        Matter.World.add(this.world, progressBar)
    }
}
