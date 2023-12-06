import Matter from '../libs/matter.js'

export default class Score {
    constructor(world) {
        this.world = world
        this.score = 0
        this.updateScoreDisplay()
    }
    generateScoreImg(x, num) {
        const scoreImg = Matter.Bodies.rectangle(x, 25, 33, 42, {
            isStatic: true,
            collisionFilter: { category: 0x0001, mask: 0x0000 },
            restitution: 0,
            render: {
                visible: true,
                sprite: {
                    texture: `images/num/${num}.png`,
                }
            }
        })
        return scoreImg
    }
    updateScoreDisplay() {
        let position = 30
        const allBodies = Matter.Composite.allBodies(this.world)
        allBodies.forEach((body) => {
            if (body.render.sprite.texture && body.render.sprite.texture.includes('images/num')) {
                Matter.World.remove(this.world, body)
            }
        })
        if (this.score >= 100) {
            const hundredDigit = Math.floor(this.score / 100)
            Matter.World.add(this.world, this.generateScoreImg(90, hundredDigit))
        }
        if (this.score >= 10) {
            position = 60
            const tenDigit = Math.floor((this.score % 100) / 10)
            Matter.World.add(this.world, this.generateScoreImg(30, tenDigit))
        }
        const oneDigit = this.score % 10
        Matter.World.add(this.world, this.generateScoreImg(position, oneDigit))
    }
}
